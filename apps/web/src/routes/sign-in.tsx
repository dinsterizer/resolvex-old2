import { Logo } from '~/components/logo'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export function SignIn() {
  return <Container>
    <Button variant={'ghost'} className="rounded-full">
        <span className="i-heroicons-chevron-left h-3 w-3 mr-1" />
        <span className="text-sm font-normal">Home</span>
    </Button>

    <main className="mt-52 max-w-md mx-auto">
      <Logo size={24} />
      <h1 className="font-title font-bold text-xl mt-3">One Step Login</h1>

      <div className="mt-7 space-y-3">
        <form className="space-y-3">
            <div className="space-y-1">
                <Label htmlFor="sign-in-email">Email</Label>
                <Input id="sign-in-email" type="email" placeholder="example@resolvex.ai" />
            </div>

            <Button className="w-full">Continue <span className="i-heroicons-arrow-right ml-3" /></Button>
        </form>

        <div className="relative">
          <div className="h-[1px] bg-border absolute top-1/2 left-0 right-0 -z-10" />
          <div className="text-center"><span className="p-1 bg-background">or</span></div>
        </div>

        <div>
          <Button variant="secondary" type="button" className="w-full">
            Continue with Google <span className="i-mdi-google ml-3" />
          </Button>
        </div>
      </div>
    </main>
  </Container>
}
