'use client'
import React, { Suspense } from 'react'
import { PageHeading } from '@repo/ui/page-heading'
import PricingPlan from '@/components/pages/protected/organization/billing/pricing-plan'
import BillingSettings from '@/components/pages/protected/organization/billing/billing-settings'
import { pageStyles } from '../general-settings/page.styles'
import { useOrganization } from '@/hooks/useOrganization'
import { LoaderCircle } from 'lucide-react'
import { useGetOrganizationBillingQuery } from '@repo/codegen/src/schema'

const OrganizationContent = () => {
  const { wrapper } = pageStyles()
  const { currentOrgId } = useOrganization()
  const [data] = useGetOrganizationBillingQuery({ pause: !currentOrgId, variables: { organizationId: currentOrgId } })

  if (data.fetching) {
    return (
      <div className="w-100 flex justify-center">
        <LoaderCircle className="animate-spin" size={20} />
      </div>
    )
  }

  return (
    <>
      {data.data?.organization.personalOrg ? (
        <div className={`flex items-center justify-center min-h-[50vh] text-center`}>
          <h2 className="text-xl w-full max-w-2xl">
            You're currently logged into your personal organization - you can switch into another organization you are a member of, or create an organization to use paid features of the Openlane
            platform.
          </h2>
        </div>
      ) : (
        <div className={`${wrapper()} w-full`}>
          <PricingPlan />
          <BillingSettings />
        </div>
      )}
    </>
  )
}

const Page: React.FC = () => {
  return (
    <>
      <PageHeading heading="Billing" eyebrow="Organization Settings" />
      <Suspense>
        <OrganizationContent />
      </Suspense>
    </>
  )
}

export default Page
