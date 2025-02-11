'use client'
import React, { useMemo, useState } from 'react'
import { PageHeading } from '@repo/ui/page-heading'
import GroupsTable from '@/components/pages/protected/groups/components/groups-table'
import { CreditCard as CardIcon, SearchIcon, Table as TableIcon } from 'lucide-react'
import GroupsCard from '@/components/pages/protected/groups/components/groups-cards'
import { Checkbox } from '@repo/ui/checkbox'
import { GroupOrderField, GroupSettingVisibility, useGetAllGroupsQuery, UserRole } from '@repo/codegen/src/schema'
import { useGroupsStore } from '@/hooks/useGroupsStore'
import CreateGroupDialog from './components/dialogs/create-group-dialog'
import GroupDetailsSheet from './components/group-details-sheet'
import { Input } from '@repo/ui/input'
import { TableSort } from '@/components/shared/table-filter/table-sort'
import { TableFilter } from '@/components/shared/table-filter/table-filter'
import { FilterField, SelectFilterField } from '@/types'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useDebounce } from '@uidotdev/usehooks'

export interface Group {
  id: string
  name: string
  description?: string
  tags: string[]
  visibility: GroupSettingVisibility
  members: {
    id: string
    user: {
      firstName?: string
      lastName?: string
      avatarFile?: { presignedURL?: string }
      avatarRemoteURL?: string
      role?: UserRole
      id: string
    }
  }[]
  isManaged: boolean
}

const filterFields: FilterField[] = [
  { key: 'name', label: 'Name', type: 'text' },
  {
    key: 'visibility',
    label: 'Visibility',
    type: 'select',
    options: [
      { label: 'Public', value: GroupSettingVisibility.PUBLIC },
      { label: 'Private', value: GroupSettingVisibility.PRIVATE },
    ],
  } as SelectFilterField,
]

const GroupsPage = () => {
  const { activeTab, setActiveTab, showAutoGenerated, setShowAutoGenerated } = useGroupsStore()
  const [whereFilters, setWhereFilters] = useState<Record<string, any>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()
  const pathname = usePathname()
  const IsMyGroups = useMemo(() => pathname === '/groups/my-groups', [pathname])
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const whereFilter = useMemo(() => {
    let conditions: Record<string, any> = IsMyGroups
      ? {
          hasMembersWith: session ? [{ userID: session.user?.userId || '' }] : [],
          ...(showAutoGenerated ? {} : { isManaged: false }),
        }
      : {}

    if (debouncedSearchQuery) {
      conditions.displayNameContainsFold = debouncedSearchQuery
    }

    return { ...conditions, ...whereFilters }
  }, [IsMyGroups, showAutoGenerated, session, whereFilters, debouncedSearchQuery])

  const queryResp = useGetAllGroupsQuery({ variables: { where: whereFilter } })

  return (
    <>
      <PageHeading heading={'Groups'} />
      <div className="flex justify-between">
        <div className="flex items-center gap-5">
          <div className="flex gap-1 size-fit bg-transparent py-0.5 px-1 border rounded-md">
            <div className={`py-1.5 px-2.5 rounded-md cursor-pointer ${activeTab === 'table' ? 'bg-card' : 'bg-transparent'}`} onClick={() => setActiveTab('table')}>
              <TableIcon size={16} />
            </div>
            <div className={`py-1.5 px-2.5 rounded-md cursor-pointer ${activeTab === 'card' ? 'bg-card' : 'bg-transparent'}`} onClick={() => setActiveTab('card')}>
              <CardIcon size={16} />
            </div>
          </div>
          <TableFilter filterFields={filterFields} onFilterChange={setWhereFilters} />
          <TableSort
            sortFields={Object.entries(GroupOrderField).map(([key, value]) => ({
              key: value as GroupOrderField,
              label: key.replace('_', ' '),
            }))}
            onSortChange={(val) => null}
          />
          <Input
            value={searchQuery}
            name="groupSearch"
            placeholder="Search..."
            className="!bg border h-[34px]"
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            icon={<SearchIcon width={17} />}
          />
          <div className="flex gap-2">
            <Checkbox checked={showAutoGenerated} onCheckedChange={(val: boolean) => setShowAutoGenerated(val)} />
            <p>Show auto generated group</p>
          </div>
        </div>
        <CreateGroupDialog />
      </div>

      {activeTab === 'table' ? <GroupsTable queryResp={queryResp} /> : <GroupsCard queryResp={queryResp} />}
      <GroupDetailsSheet />
    </>
  )
}

export default GroupsPage
