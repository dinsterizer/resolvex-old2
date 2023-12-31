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
  onSuccess?: () => void
}

export function WorkspaceLeaveDialog({ children, workspaceId, onSuccess, ...props }: Props) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const mutation = trpc.workspace.leave.useMutation({
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
            This action cannot be undone. Leaving the workspace will result in permanent data loss. If no other members
            are in the workspace, it will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
          <Button variant="destructive" type="button" onClick={() => mutation.mutate({ workspaceId })}>
            Continue
            {mutation.isLoading && <Loader2 size={16} className="animate-spin ml-1" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
