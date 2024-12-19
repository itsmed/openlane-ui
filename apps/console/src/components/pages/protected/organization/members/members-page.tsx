'use client'

import { pageStyles } from './page.styles'
import { OrganizationInviteForm } from '@/components/pages/protected/organization/members/organization-invite-form'
import { OrganizationInvites } from '@/components/pages/protected/organization/members/organization-invites'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useGetInvitesQuery } from '@repo/codegen/src/schema'
import { MembersTable } from './members-table'
import { userCanInviteAdmins } from '@/lib/authz/utils'

const MembersPage: React.FC = async () => {
  const { wrapper, inviteCount, inviteRow } = pageStyles()
  const defaultTab = 'members'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { data: session } = useSession()
  const [{ data }] = useGetInvitesQuery({
    pause: !session,
  })

  // Check if the user can invite admins or only members
  const { data: inviteAdminPermissions, error } = await userCanInviteAdmins(session)

  const numInvites = Array.isArray(data?.invites.edges)
    ? data?.invites.edges.length
    : 0

  return (
    <>
      <Tabs
        variant="solid"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
        }}
      >
        <TabsList>
          <TabsTrigger value="members">Member list</TabsTrigger>
          <TabsTrigger value="invites">
            <div className={inviteRow()}>
              <span>Invitations</span>
              {numInvites > 0 && (
                <div className={inviteCount({ activeBg: activeTab === 'invites' })}>{numInvites}</div>
              )}
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          <MembersTable setActiveTab={setActiveTab} />
        </TabsContent>
        <TabsContent value="invites">
          <div className={wrapper()}>
            <OrganizationInviteForm inviteAdmins={inviteAdminPermissions?.allowed} />
            <OrganizationInvites />
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MembersPage
