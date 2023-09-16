import { useNavigate } from '@tanstack/react-router'
import { useId } from 'react'
import { workspaceDetailRoute } from '~/routes/workspace-detail'
import { trpc } from '~/utils/trpc'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'

export function CreateWorkspaceSheet({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const nameId = useId()
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
    const data = Object.fromEntries(new FormData(e.currentTarget)) as { name: string }
    mutate(data)
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

          <div className="flex justify-end gap-4">
            <SheetClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </SheetClose>
            <Button>{isLoading && <span className="i-heroicons-arrow-path animate-spin mr-3" />} Create</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
