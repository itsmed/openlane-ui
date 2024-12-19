import { tv, type VariantProps } from 'tailwind-variants'

export const pageHeadingStyles = tv({
  slots: {
    wrapper: 'flex flex-col gap-[2px] mb-10',
    eyebrow:
      'font-sans text-text-header uppercase tracking-[0.025rem] text-[10px]',
    heading: 'text-3xl tracking-[-0.056rem] text-header font-serif',
  },
})

export type PageHeadingVariants = VariantProps<typeof pageHeadingStyles>
