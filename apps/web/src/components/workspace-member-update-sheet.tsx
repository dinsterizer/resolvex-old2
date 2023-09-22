import { Loader2 } from 'lucide-react'
import { ComponentPropsWithoutRef, useId, useRef, useState } from 'react'
import { match } from 'ts-pattern'
import { trpc } from '~/utils/trpc'
import { GeneralSkeleton } from './general-skeleton'
import { QueryError } from './query-error'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, Sheet } from './ui/sheet'

type Props = ComponentPropsWithoutRef<typeof Sheet> & {
  workspaceId: string
  userId: string
}

export function WorkspaceMemberUpdateSheet({ children, workspaceId, userId, ...props }: Props) {
  const emailId = useId()
  const adminRoleId = useId()
  const basicMemberRoleId = useId()
  const closeElement = useRef<HTMLButtonElement>(null)

  const [role, setRole] = useState<'basic_member' | 'admin' | null>(null)

  const query = trpc.workspace.detail.useQuery({ workspaceId })
  const mutation = trpc.workspace.member.update.useMutation({
    onSuccess() {
      closeElement.current?.click()
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    mutation.mutate({
      workspaceId,
      userId,
      role: formData.get('role') as 'basic_member' | 'admin',
    })
  }

  return (
    <Sheet {...props}>
      {children}
      <SheetContent>
        {match(query)
          .with({ status: 'loading' }, () => <GeneralSkeleton count={5} />)
          .with({ status: 'error' }, () => <QueryError />)
          .with({ status: 'success' }, (query) => {
            const member = query.data.workspace.members.find((member) => member.userId === userId)

            if (!member) {
              return <QueryError />
            }

            return (
              <>
                <SheetHeader>
                  <SheetTitle>Update member</SheetTitle>
                  <SheetDescription>Update member role or remove member from workspace.</SheetDescription>
                </SheetHeader>
                <form className="space-y-4 mt-6" onSubmit={onSubmit}>
                  <div className="space-y-1">
                    <Label htmlFor={emailId} className="text-right">
                      Email
                    </Label>
                    <Input
                      id={emailId}
                      value={member.user.email}
                      type="email"
                      name="email"
                      required
                      className="col-span-3"
                      disabled
                    />
                  </div>

                  <RadioGroup
                    defaultValue="basic_member"
                    name="role"
                    value={role || member.role}
                    onValueChange={(v) => setRole(v as 'admin' | 'basic_member')}
                  >
                    <div className="items-top flex space-x-2 p-4 rounded-md border">
                      <RadioGroupItem id={adminRoleId} value="admin" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={adminRoleId}>Admin</Label>
                        <p className="text-sm text-muted-foreground">
                          Not limited by any permissions, can invite new members and change workspace settings.
                          <span className="text-destructive"> Be careful!</span>
                        </p>
                      </div>
                    </div>

                    <div className="items-top flex space-x-2 p-4 rounded-md border">
                      <RadioGroupItem id={basicMemberRoleId} value="basic_member" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor={basicMemberRoleId}>Basic member</Label>
                        <p className="text-sm text-muted-foreground">
                          Can only view and reply to customers, can&apos;t change workspace settings.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="flex justify-end gap-4">
                    <SheetClose asChild>
                      <Button ref={closeElement} type="button" variant="secondary">
                        Close
                      </Button>
                    </SheetClose>
                    <Button disabled={mutation.isLoading}>
                      Submit {mutation.isLoading && <Loader2 size={16} className="animate-spin ml-1" />}
                    </Button>
                  </div>
                </form>
              </>
            )
          })
          .exhaustive()}
      </SheetContent>
    </Sheet>
  )
}
