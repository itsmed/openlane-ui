'use client'
import { GetVendorQuery, useGetVendorQuery } from '@repo/codegen/src/schema'
import { useSession } from 'next-auth/react'
import { pageStyles } from './page.styles'
import { useState, useEffect } from 'react'
import { Input } from '@repo/ui/input'
import { Copy } from 'lucide-react'
import { DataTable } from '@repo/ui/data-table'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@repo/ui/dropdown-menu'
import { ColumnDef, VisibilityState } from '@tanstack/react-table'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { useToast } from '@repo/ui/use-toast'
import { Button } from '@repo/ui/button'
import { Badge } from '@repo/ui/badge'
import { PlusIcon } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { Actions } from './actions/actions'
import { SelectSeparator } from '@repo/ui/select'

type VendorEdge = NonNullable<NonNullable<GetVendorQuery['entities']>['edges']>[number]

type Vendor = NonNullable<VendorEdge>['node']

export const VendorsTable = () => {
  const { vendorSearchRow, vendorSearchField, vendorButtons, actionIcon, nameRow, copyIcon } = pageStyles()
  const { data: session } = useSession()
  const [vendors, setVendor] = useState<Vendor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const { toast } = useToast()

  const [{ data, fetching, error }, refetch] = useGetVendorQuery({
    pause: !session,
  })

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    displayName: true,
    status: true,
    description: true,
    domains: true,
    tags: true,
    updatedBy: false,
    updatedAt: false,
    createdBy: false,
    createdAt: false,
    id: false,
  })

  useEffect(() => {
    if (copiedText) {
      toast({
        title: 'Copied to clipboard',
        variant: 'success',
      })
    }
  }, [copiedText])

  useEffect(() => {
    if (data?.entities?.edges) {
      const vendors = data.entities.edges.map((edge) => edge?.node).filter((node) => node !== null) as Vendor[]
      setVendor(vendors)
    }
  }, [data])

  if (error || fetching) return null

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase()
    setSearchTerm(searchValue)
  }
  const handleCreateNew = () => {
    console.log('create new vendor')
  }

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: 'displayName',
      header: 'Name',
      cell: ({ row }) => {
        const displayName = `${row?.original?.displayName}`
        return (
          <div className={nameRow()}>
            {displayName}
            <Copy width={16} height={16} className={copyIcon()} onClick={() => copyToClipboard(displayName)} />
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = `${row?.original?.status}`
        return <div className={nameRow()}>{status}</div>
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = `${row?.original?.description}`
        const tags = row?.original?.tags as string[]
        return (
          <div className={nameRow() + ' grid grid-flow-col grid-rows-2 grid-cols-3'}>
            <div className="border-b-2 border-dashed col-span-full">{description}</div>
            {/* <div className={'border-t-2 border-dashed border-dotted pt-2 m-3 w-[350px] ' + (description.length ? 'relative top-5 -left-[138px]' : '')}> */}
            <div className="flex flex-wrap col-span-full">
              {tags.map((tag) => (
                <Badge className="m-1 mt-0" variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'domains',
      header: 'Domains',
      cell: ({ row }) => {
        const domains = row?.original?.domains as string[]
        return (
          <div className={nameRow()}>
            {domains.map((domain) => (
              <span>{domain}</span>
            ))}
            <Copy width={16} height={16} className={copyIcon()} onClick={() => copyToClipboard(domains)} />
          </div>
        )
      },
    },
    {
      accessorKey: 'createdBy',
      header: 'Created By',
      cell: ({ row }) => {
        const createdBy = `${row?.original?.createdBy}`
        return <div className={nameRow()}>{createdBy}</div>
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => {
        const createdAt = `${row?.original?.createdAt}`
        return <div className={nameRow()}>{formatDate(createdAt)}</div>
      },
    },
    {
      accessorKey: 'updatedBy',
      header: 'Updated By',
      cell: ({ row }) => {
        const updatedBy = `${row?.original?.updatedBy}`
        return <div className={nameRow()}>{updatedBy}</div>
      },
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      cell: ({ row }) => {
        const updatedAt = `${row?.original?.updatedAt}`
        return <div className={nameRow()}>{formatDate(updatedAt)}</div>
      },
    },
    {
      accessorKey: 'id',
      header: 'Id',
      cell: ({ row }) => {
        const id = `${row?.original?.id}`
        return <div className={nameRow()}>{id}</div>
      },
    },
    {
      accessorKey: 'actions',
      header: '',
      cell: ({ cell }) => <Actions vendorId={cell.getValue() as string} />,
      size: 40,
      enableHiding: false,
    },
  ]

  return (
    <div>
      <div className={vendorSearchRow()}>
        <div className={vendorSearchField()}>
          <Input placeholder="Search for Vendor" value={searchTerm} onChange={handleSearch} />
        </div>
        <Button icon={<PlusIcon />} iconPosition="left" onClick={handleCreateNew}>
          Create New
        </Button>
      </div>
      <DataTable columns={columns} data={vendors} showVisibility={true} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} loading={fetching} />
    </div>
  )
}
