import { Loader2 } from 'lucide-react'
import { ComponentPropsWithRef, useRef } from 'react'
import { trpc } from '~/utils/trpc'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'
import { Button } from './ui/button'

type Props = ComponentPropsWithRef<typeof AlertDialog> & {
  workspaceId: string
  userId: string
  onSuccess?: () => void
}

export function WorkspaceMemberRemoveDialog({ children, workspaceId, userId, onSuccess, ...props }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const mutation = trpc.workspace.member.remove.useMutation({
    onSuccess() {
      onSuccess?.()
      cancelRef.current?.click()
    },
  })

  return (
    <AlertDialog {...props}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. When a member is removed, they will lose access to the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
          <Button variant="destructive" type="button" onClick={() => mutation.mutate({ workspaceId, userId })}>
            Continue
            {mutation.isLoading && <Loader2 size={16} className="animate-spin ml-1" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
