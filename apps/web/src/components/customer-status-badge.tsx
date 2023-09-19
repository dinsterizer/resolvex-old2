import { SelectCustomer } from '@resolvex/api/src/schema'
import { cva } from 'class-variance-authority'
import { CheckCircle2, Circle, MinusCircle, XCircle } from 'lucide-react'
import { match } from 'ts-pattern'

type Props = {
  status: SelectCustomer['status']
}

const variants = cva('px-2 py-1 border rounded-md flex items-center gap-1', {
  variants: {
    status: {
      waiting: 'text-yellow-500',
      helping: 'text-blue-500',
      helped: 'text-green-500',
      spam: 'text-red-500',
    },
  },
})

export function CustomerStatusBadge({ status }: Props) {
  return (
    <div className={variants({ status })}>
      {match(status)
        .with('waiting', () => <Circle size={14} />)
        .with('helping', () => <MinusCircle size={14} />)
        .with('helped', () => <CheckCircle2 size={14} />)
        .with('spam', () => <XCircle size={14} />)
        .exhaustive()}
      <span className="text-xs">{status}</span>
    </div>
  )
}
