import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, ChevronLeft, RotateCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { Logo } from '~/components/logo'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useToast } from '~/components/ui/use-toast'
import { env } from '~/env'
import { Google } from '~/icons/google'
import { workspaceListRoute } from '~/routes/workspace-list'
import { useAuthStore } from '~/stores/auth'
import { trpc } from '~/utils/trpc'

export function Login() {
  const auth = useAuthStore()
  const { toast } = useToast()
  const [step, setStep] = useState<'send-otp' | 'verify-otp'>('send-otp')
  const [email, setEmail] = useState<string>('')
  const emailSendOtpMutation = trpc.auth.login.email.sendOtp.useMutation({
    onSuccess(_data, variables) {
      toast({
        title: 'Please check your email for the OTP',
      })
      setEmail(variables.email)
      setStep('verify-otp')
    },
  })
  const emailVerifyOtpMutation = trpc.auth.login.email.verifyOtp.useMutation({
    onSuccess(data) {
      auth.login(data)
    },
  })

  return (
    <>
      <Container className="mt-4" asChild>
        <header>
          <Button variant="ghost" size="sm" asChild>
            <a href={env.DOCS_URL}>
              <ChevronLeft size={16} className="mr-1" />
              Home
            </a>
          </Button>
        </header>
      </Container>

      <Container className="mt-40 max-w-md mx-auto" asChild>
        <main>
          <Logo size={24} />
          {step === 'send-otp' && <h1 className="font-title font-bold text-xl mt-3">One Step Login</h1>}
          {step === 'verify-otp' && <h1 className="font-title font-bold text-xl mt-3">Enter the 6-char OTP</h1>}

          {step === 'verify-otp' && (
            <p className="text-muted-foreground text-sm mt-2">
              We sent it to your email <span className="font-bold text-foreground">{email}</span>
            </p>
          )}

          <div className="mt-7 space-y-3">
            {step === 'send-otp' && (
              <SendOtpForm
                isLoading={emailSendOtpMutation.isLoading}
                onSubmit={(data) => emailSendOtpMutation.mutate(data)}
              />
            )}

            {step === 'verify-otp' && (
              <VerifyOtpForm
                isLoading={emailVerifyOtpMutation.isLoading}
                onBack={() => setStep('send-otp')}
                onSubmit={async ({ otp }) => emailVerifyOtpMutation.mutate({ email, otp })}
              />
            )}

            {step === 'send-otp' && (
              <div className="relative">
                <div className="h-[1px] bg-border absolute top-[calc(50%+0.5px)] left-0 right-0 -z-10" />
                <div className="text-center">
                  <span className="p-1 bg-background">or</span>
                </div>
              </div>
            )}

            {step === 'verify-otp' && (
              <Button
                disabled={emailSendOtpMutation.isLoading}
                variant="ghost"
                className="w-full text-muted-foreground"
                type="button"
                onClick={() => {
                  emailSendOtpMutation.mutate({ email })
                }}
              >
                Resend OTP
                {emailSendOtpMutation.isLoading && <RotateCw size={16} className="animate-spin ml-2" />}
              </Button>
            )}

            {step === 'send-otp' && (
              <div>
                <LoginWithGoogleButton />
              </div>
            )}
          </div>
        </main>
      </Container>
    </>
  )
}
type SendOtpFormData = { email: string }
function SendOtpForm({ onSubmit, isLoading }: { onSubmit: (data: SendOtpFormData) => void; isLoading: boolean }) {
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(Object.fromEntries(new FormData(e.currentTarget)) as SendOtpFormData)
      }}
    >
      <div>
        <Label htmlFor="login-email" className="mb-2">
          Email
        </Label>
        <Input id="login-email" type="email" name="email" required placeholder="example@resolvex.ai" />
      </div>

      <Button className="w-full" disabled={isLoading}>
        Continue
        {isLoading ? <RotateCw size={16} className="animate-spin ml-2" /> : <ArrowRight size={16} className="ml-2" />}
      </Button>
    </form>
  )
}

type VerifyOtpFormData = { otp: string }
function VerifyOtpForm({
  onSubmit,
  onBack,
  isLoading,
}: {
  onSubmit: (data: VerifyOtpFormData) => void
  onBack: () => void
  isLoading: boolean
}) {
  const [otp, setOtp] = useState<string>('')

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ otp })
      }}
    >
      <div>
        <Label className="mb-2">OTP</Label>
        <OtpInput
          containerStyle={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => <Input {...props} className="p-0 !w-12 h-16" required />}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" type="button" onClick={() => onBack()} className="w-full">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <Button className="w-full" disabled={isLoading}>
          Continue
          {isLoading ? <RotateCw size={16} className="animate-spin ml-2" /> : <ArrowRight size={16} className="ml-2" />}
        </Button>
      </div>
    </form>
  )
}

export function LoginWithGoogleButton() {
  const navigate = useNavigate()
  const auth = useAuthStore()
  const { mutate, isLoading } = trpc.auth.login.google.verifyAuthCode.useMutation({
    onSuccess(data) {
      auth.login(data)
      navigate({ to: workspaceListRoute.to })
    },
  })
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  authUrl.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
  authUrl.searchParams.set('redirect_uri', window.location.origin)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set(
    'scope',
    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  )

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code')
    if (!code) return

    mutate({ code })
  }, [mutate])

  return (
    <Button variant="secondary" type="button" className="w-full" asChild>
      <a href={authUrl.toString()}>
        Continue with Google
        {isLoading ? <RotateCw size={16} className="animate-spin ml-2" /> : <Google size={16} className="ml-2" />}
      </a>
    </Button>
  )
}
