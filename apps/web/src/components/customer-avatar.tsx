type Props = {
  customerName: string
  size?: number
}

export function CustomerAvatar({ customerName, size = 20 }: Props) {
  return (
    <div
      className="font-title flex items-center justify-center bg-foreground text-background rounded-full"
      style={{ width: size, height: size }}
    >
      {customerName[0] ?? 'A'}
    </div>
  )
}
