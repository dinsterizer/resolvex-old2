import { SelectCustomer } from '@resolvex/api/src/schema'
import { cva } from 'class-variance-authority'
import { CheckCircle2, Circle, MinusCircle, XCircle } from 'lucide-react'
import React from 'react'

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
  let icon: React.ReactNode | null = null

  if (status === 'waiting') {
    icon = <Circle size={14} />
  } else if (status === 'helping') {
    icon = <MinusCircle size={14} />
  } else if (status === 'helped') {
    icon = <CheckCircle2 size={14} />
  } else if (status === 'spam') {
    icon = <XCircle size={14} />
  } else {
    // TODO: throw typescript error can catch on tsc not on runtime js error
    icon as never
  }
  return (
    <div className={variants({ status })}>
      {icon}
      <span className="text-xs">{status}</span>
    </div>
  )
}
