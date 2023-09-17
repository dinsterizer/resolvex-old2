import { ComponentPropsWithoutRef } from 'react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

type Props = ComponentPropsWithoutRef<typeof Alert>
export function TODOAlert(props: Props) {
  return (
    <Alert {...props}>
      <span className="i-heroicons-code-bracket h-5 w-5" />
      <AlertTitle>Not implemented yet</AlertTitle>
      <AlertDescription>Your section you are looking for is under construction</AlertDescription>
    </Alert>
  )
}
