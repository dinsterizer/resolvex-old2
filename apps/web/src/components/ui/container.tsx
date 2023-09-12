import { type ComponentPropsWithRef, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '~/lib/utils'

type ContainerProps = ComponentPropsWithRef<'div'> & {
  asChild?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'

  return <Comp
        ref={ref}
        className={cn('p-4 container mx-auto', className)}
        {...props}
    />
})

Container.displayName = 'Container'
