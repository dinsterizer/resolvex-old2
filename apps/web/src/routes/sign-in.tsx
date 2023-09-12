import { useState } from 'react'
import type { Output } from 'valibot'
import { email, length, object, parse, string } from 'valibot'
import OtpInput from 'react-otp-input'
import { Logo } from '~/components/logo'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { env } from '~/env'
import { trpc } from '~/utils/trpc'

export function SignIn() {
  const [step, setStep] = useState<'send-otp' | 'verify-otp'>('send-otp')
  const [email, setEmail] = useState<string>('')
  const emailSendOtpMutation = trpc.auth.signIn.email.sendOtp.useMutation()
  const emailVerifyOtpMutation = trpc.auth.signIn.email.verifyOtp.useMutation()

  return <Container>
    <Button variant={'ghost'} className="rounded-full" asChild>
        <a href={env.DOCS_URL}>
          <span className="i-heroicons-chevron-left h-3 w-3 mr-1" />
          <span className="text-sm font-normal">Home</span>
        </a>
    </Button>

    <main className="mt-52 max-w-md mx-auto">
      <Logo size={24} />
      {step === 'send-otp' && <h1 className="font-title font-bold text-xl mt-3">One Step Login</h1>}
      {step === 'verify-otp' && <h1 className="font-title font-bold text-xl mt-3">Enter the 6-character OTP</h1>}

      {step === 'verify-otp' && <p className="text-muted-foreground text-sm mt-2">We sent it to your email <span className="font-bold text-foreground">{email}</span></p>}

      <div className="mt-7 space-y-3">
        {step === 'send-otp' && <SendOtpForm isLoading={emailSendOtpMutation.isLoading} onSubmit={async ({ email }) => {
          await emailSendOtpMutation.mutateAsync({ email })
          setEmail(email)
          setStep('verify-otp')
        }} />}

        {step === 'verify-otp' && <VerifyOtpForm isLoading={emailVerifyOtpMutation.isLoading} onBack={() => setStep('send-otp')} onSubmit={({ otp }) => {
          emailVerifyOtpMutation.mutate({ email, otp })
        }} />}

      {step === 'send-otp'
        && <div className="relative">
          <div className="h-[1px] bg-border absolute top-1/2 left-0 right-0 -z-10" />
          <div className="text-center"><span className="p-1 bg-background">or</span></div>
        </div>
      }

        {step === 'send-otp' && <div>
          <Button variant="secondary" type="button" className="w-full">
            Continue with Google <span className="i-mdi-google ml-3" />
          </Button>
        </div>}
      </div>
    </main>
  </Container>
}

const sendOtpFormSchema = object({ email: string([email()]) })
function SendOtpForm({ onSubmit, isLoading }: { onSubmit: (data: Output<typeof sendOtpFormSchema>) => void; isLoading: boolean }) {
  return <form className="space-y-3" onSubmit={(e) => {
    e.preventDefault()
    onSubmit(parse(sendOtpFormSchema, Object.fromEntries(new FormData(e.currentTarget))))
  }}>
    <div className="space-y-1">
        <Label htmlFor="sign-in-email">Email</Label>
        <Input id="sign-in-email" type="email" name="email" required placeholder="example@resolvex.ai" />
    </div>

    <Button className="w-full">
      Continue
      {isLoading ? <span className="i-heroicons-arrow-path animate-spin ml-3" /> : <span className="i-heroicons-arrow-right ml-3" />}
    </Button>
  </form>
}

const verifyOtpFormSchema = object({ otp: string([length(6)]) })
function VerifyOtpForm(
  {
    onSubmit,
    onBack,
    isLoading,
  }:
  { onSubmit: (data: Output<typeof verifyOtpFormSchema>) => void
    onBack: () => void
    isLoading: boolean
  }) {
  const [otp, setOtp] = useState<string>('')

  return <form className="space-y-3" onSubmit={(e) => {
    e.preventDefault()
    onSubmit(parse(verifyOtpFormSchema, { otp }))
  }}>
    <div className="space-y-1">
        <Label >OTP</Label>
        <OtpInput
          containerStyle={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={props => <Input {...props} className="p-0 !w-12 h-16" required />}
        />
    </div>

    <div className="flex gap-3">
      <Button variant="secondary" type="button" onClick={() => onBack()} className="w-full"><span className="i-heroicons-arrow-left mr-3" /> Back</Button>
      <Button className="w-full">
        Continue
        {isLoading ? <span className="i-heroicons-arrow-path animate-spin ml-3" /> : <span className="i-heroicons-arrow-right ml-3" />}
    </Button>
    </div>
  </form>
}
