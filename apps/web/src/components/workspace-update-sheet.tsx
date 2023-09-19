import { Loader2 } from 'lucide-react'
import { ComponentPropsWithoutRef, useId, useState } from 'react'
import { match } from 'ts-pattern'
import { trpc } from '~/utils/trpc'
import { GeneralSkeleton } from './general-skeleton'
import { QueryError } from './query-error'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet'

type Props = ComponentPropsWithoutRef<typeof Sheet> & {
  workspaceId: string
}

export function UpdateWorkspaceSheet({ workspaceId, children, ...props }: Props) {
  const idId = useId()
  const nameId = useId()
  const query = trpc.workspace.detail.useQuery({ workspaceId })
  const mutation = trpc.workspace.update.useMutation({
    onSuccess() {
      props.onOpenChange?.(false)
    },
  })
  const [name, setName] = useState<string | undefined>()

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value
    mutation.mutate({ workspace: { id: workspaceId, name } })
  }

  return (
    <Sheet {...props}>
      {children}
      <SheetContent>
        {match(query)
          .with({ status: 'loading' }, () => <GeneralSkeleton count={5} />)
          .with({ status: 'error' }, () => <QueryError />)
          .with({ status: 'success' }, (query) => (
            <>
              <SheetHeader>
                <SheetTitle>Update workspace</SheetTitle>
                <SheetDescription>Update basic information about your workspace.</SheetDescription>
              </SheetHeader>
              <form className="space-y-4 mt-6" onSubmit={onSubmit}>
                <div className="space-y-1">
                  <Label htmlFor={idId} className="text-right">
                    ID
                  </Label>
                  <Input id={idId} className="col-span-3" disabled value={query.data.workspace.id} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={nameId} className="text-right">
                    Name
                  </Label>
                  <Input
                    id={nameId}
                    className="col-span-3"
                    placeholder="Your workspace"
                    name="name"
                    value={name ?? query.data.workspace.name}
                    required
                    onChange={(e) => setName(e.currentTarget.value)}
                    minLength={3}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <SheetClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </SheetClose>
                  <Button disabled={mutation.isLoading}>
                    Submit {mutation.isLoading && <Loader2 size={16} className="animate-spin ml-1" />}
                  </Button>
                </div>
              </form>
            </>
          ))
          .exhaustive()}
      </SheetContent>
    </Sheet>
  )
}
