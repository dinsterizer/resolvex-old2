import { SearchX } from 'lucide-react'

export function Empty() {
  return (
    <div className="mx-auto max-w-md flex items-center flex-col py-12 px-4">
      <SearchX size={48} className="text-foreground" />
      <h2 className="font-title text-xl font-medium text-foreground text-center mt-3">No results found</h2>
      <p className="text-muted-foreground text-center mt-1">Please try another search term</p>
    </div>
  )
}
