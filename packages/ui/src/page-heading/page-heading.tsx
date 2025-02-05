'use client'

import React from 'react'
import { cn } from '../../lib/utils'
import { pageHeadingStyles, type PageHeadingVariants } from './page-heading.styles'

interface PageHeadingProps extends PageHeadingVariants {
  className?: string
  heading: React.ReactNode | string
  eyebrow?: React.ReactNode | string
  editable?: boolean
  onChange?: (value: string) => void
}

const PageHeading: React.FC<PageHeadingProps> = ({ heading, eyebrow, className, editable, onChange }) => {
  const styles = pageHeadingStyles()

  const [editing, setEditing] = React.useState<boolean>(false)

  const isEditing = editable && editing

  const onBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
    setEditing(false)
  }

  const headingClasses = !editable ? styles.heading() : cn(['cursor-pointer hover:bg-black', styles.heading()])

  return (
    <div className={cn(styles.wrapper(), className)}>
      {eyebrow && <span className={styles.eyebrow()}>{eyebrow}</span>}
      {!isEditing ? (
        <h2 className={headingClasses} onClick={(e) => setEditing(!editing)}>
          {heading}
        </h2>
      ) : (
        <input className="" defaultValue={heading as string} onBlur={onBlurHandler} />
      )}
    </div>
  )
}

export { PageHeading }
