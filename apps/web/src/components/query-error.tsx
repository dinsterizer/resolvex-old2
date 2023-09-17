import { AlertCircle } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'

type Props = ComponentPropsWithoutRef<typeof Alert> & {
  title?: string
  description?: string
}

export function QueryError({ title, description, ...props }: Props) {
  return (
    <Alert variant="destructive" {...props}>
      <AlertCircle size={20} />
      <AlertTitle>{title || 'Something went wrong'}</AlertTitle>
      <AlertDescription>{description || 'Please try again later'}</AlertDescription>
    </Alert>
  )
}
