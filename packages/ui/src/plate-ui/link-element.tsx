'use client'

import React from 'react'

import type { TLinkElement } from '@udecode/plate-link'

import { cn, withRef } from '@udecode/cn'
import { useElement } from '@udecode/plate-common/react'
import { useLink } from '@udecode/plate-link/react'

import { PlateElement } from './plate-element'

export const LinkElement = withRef<typeof PlateElement>(({ children, className, ...props }, ref) => {
  const element = useElement<TLinkElement>()
  const { props: linkProps } = useLink({ element })

  return (
    <PlateElement
      ref={ref}
      as="a"
      className={cn('font-medium text-oxford-blue-900 underline decoration-primary underline-offset-4 dark:text-oxford-blue-50', className)}
      {...(linkProps as any)}
      {...props}
    >
      {children}
    </PlateElement>
  )
})
