import { tv, type VariantProps } from 'tailwind-variants'

export const tableStyles = tv({
  slots: {
    container: 'relative w-full overflow-auto border dark:border-oxford-blue-700 rounded-lg',
    table: 'w-full caption-bottom font-sans bg-white dark:bg-glaucous-900',
    tableHeader: '[&_tr]:border-b text-left',
    tableBody: '[&_tr:last-child]:border-0',
    tableFooter:
      'p-1 border-oxford-blue-200 dark:border-oxford-blue-700 font-medium [&>tr]:last:border-b-0 ',
    tableRow:
      'border-b border-oxford-blue-200 dark:border-oxford-blue-700 transition-colors data-[state=selected]:bg-java-500',
    tableHead:
      'h-12 px-4 text-left align-middle font-medium text-neutral-800 [&:has([role=checkbox])]:pr-0 dark:text-neutral-300',
    tableCell:
      'p-4 text-firefly-950 dark:text-ziggurat-200 align-middle [&:has([role=checkbox])]:pr-0',
    tableCaption: 'mt-4 text-sm text-ziggurat-500 dark:text-ziggurat-400',
  },
})

export type TableVariants = VariantProps<typeof tableStyles>
