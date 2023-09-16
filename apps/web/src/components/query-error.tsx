import { ComponentPropsWithoutRef } from 'react'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'

type Props = ComponentPropsWithoutRef<typeof Alert> & {
  title?: string
  description?: string
}

export function QueryError({ title, description, ...props }: Props) {
  return (
    <Alert variant="destructive" {...props}>
      <span className="i-heroicons-exclamation-circle h-5 w-5" />
      <AlertTitle>{title || 'Something went wrong'}</AlertTitle>
      <AlertDescription>{description || 'Please try again later'}</AlertDescription>
    </Alert>
  )
}
