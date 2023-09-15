export function End() {
  return (
    <div className="relative">
      <div className="h-[1px] bg-border/40 absolute top-[calc(50%+0.5px)] left-0 right-0 -z-10" />
      <div className="text-center">
        <span className="p-1 bg-background text-xs text-muted-foreground/80 tracking-widest">end</span>
      </div>
    </div>
  )
}
