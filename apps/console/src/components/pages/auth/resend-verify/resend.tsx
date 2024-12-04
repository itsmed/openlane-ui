'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@repo/ui/button'
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
} from '@repo/ui/form'
import { Input } from '@repo/ui/input'
import { resendStyles } from './resend.styles'
import { resendVerification } from '@/lib/user'
import { useRouter } from 'next/navigation'
import { Panel } from '@repo/ui/panel'
import { Logo } from '@repo/ui/logo'

const formSchema = z.object({
  email: z.string().email(),
})

export const Resend = () => {
  const router = useRouter()

  const {
    wrapper,
    input,
    button,
    text,
    header,
    logo,
  } = resendStyles()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = ({ email }: z.infer<typeof formSchema>) => {
    const result = resendVerification({ email })
    router.push('/verify')
  }


  return (
    <>
      <Panel>
        <div className={logo()}>
          <Logo width={300} />
        </div>
        <h2 className={header()}>Can't find that email?</h2>
        <p className={text()}>
          We got you, enter your email to have our robots <br />
          resend that verification email right over to you. </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={wrapper()}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane.doe@example.com"
                      className={input()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />
            <Button type="submit" className={button()}>
              Resend Verification
            </Button>
          </form>
        </Form>
      </Panel >
    </>
  )
}
