import { useNavigate } from '@tanstack/react-router'
import { RotateCw } from 'lucide-react'
import { useId } from 'react'
import { workspaceDetailRoute } from '~/routes/workspace-detail'
import { trpc } from '~/utils/trpc'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

export function CreateWorkspaceSheet({ children }: { children: React.ReactNode }) {
  const nameId = useId()
  const demoDataId = useId()

  const navigate = useNavigate()
  const { mutate, isLoading } = trpc.workspace.create.useMutation({
    onSuccess(data) {
      navigate({
        to: workspaceDetailRoute.to,
        params: {
          workspaceId: data.id,
        },
      })
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value
    const withDemoData = (e.currentTarget.elements.namedItem('with-demo-data') as HTMLInputElement).checked
    mutate({ name, withDemoData })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create workspace</SheetTitle>
          <SheetDescription>Each workspace contains separate customers, emails, chats and settings.</SheetDescription>
        </SheetHeader>
        <form className="space-y-4 mt-6" onSubmit={onSubmit}>
          <div className="space-y-1">
            <Label htmlFor={nameId} className="text-right">
              Name
            </Label>
            <Input id={nameId} className="col-span-3" placeholder="Your workspace" name="name" required minLength={3} />
          </div>

          <div className="items-top flex space-x-2 p-4 rounded-md border">
            <Checkbox id={demoDataId} name="with-demo-data" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={demoDataId}>With demo data</Label>
              <p className="text-sm text-muted-foreground">
                Explore the features of the app with demo data.{' '}
                <span className="text-destructive">Not recommended for production.</span>
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <SheetClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </SheetClose>
            <Button disabled={isLoading}>
              Submit {isLoading && <RotateCw size={16} className="animate-spin ml-1" />}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
