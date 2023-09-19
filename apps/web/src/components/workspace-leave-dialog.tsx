import { Loader2 } from 'lucide-react'
import { useState } from 'react'
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

type Props = {
  children: React.ReactNode
  workspaceId: string
  onSuccess?: () => void
}

export function LeaveWorkspaceDialog({ children, workspaceId, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const mutation = trpc.workspace.leave.useMutation({
    onSuccess() {
      onSuccess?.()
      setOpen(false)
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You will leave the workspace and lose access to all data. If the workspace has
            no other members, it will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" type="button" onClick={() => mutation.mutate({ workspaceId })}>
            Continue
            {mutation.isLoading && <Loader2 size={16} className="animate-spin ml-1" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
