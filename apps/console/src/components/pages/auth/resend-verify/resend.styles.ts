import { tv, type VariantProps } from 'tailwind-variants'

const resendStyles = tv({
  slots: {
    logo: 'flex justify-center mb-10',
    text: "text-center text-sm text-text-light",
    header: "text-xl text-center text-text-light",
    wrapper: 'relative mt-1 flex flex-col gap-2 md:flex-row',
    input: 'w-full h-12 md:h-auto text-oxford-blue-900',
    button:
      'absolute h-10 text-md md:relative md:text-md md:top-0 md:h-14',
    errorMessage: 'text-oxford-blue-200 mt-14',
    success:
      'mt-14 text-center bg-oxford-blue-900 bg-opacity-20 p-5 rounded-md text-white flex gap-3',
    successMessage: 'flex-1',
    successIcon: 'mt-1',
  },
})


export type ResendVariants = VariantProps<typeof resendStyles>

export { resendStyles }
