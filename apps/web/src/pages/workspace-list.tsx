import { ChevronLeft, LogOut, Plus } from 'lucide-react'
import { CreateWorkspaceSheet } from '~/components/create-workspace-sheet'
import { Empty } from '~/components/empty'
import { End } from '~/components/end'
import { Logo } from '~/components/logo'
import { QueryError } from '~/components/query-error'
import { Button } from '~/components/ui/button'
import { Container } from '~/components/ui/container'
import { ViewportBlock } from '~/components/viewport-block'
import { WorkspaceCard, WorkspaceCardSkeleton } from '~/components/workspace-cart'
import { env } from '~/env'
import { useAuthedStore } from '~/stores/auth'
import { trpc } from '~/utils/trpc'

export function WorkspaceListPage() {
  const authed = useAuthedStore()
  const { data, hasNextPage, isError, isSuccess, fetchNextPage, isFetching, isLoading } =
    trpc.workspace.list.useInfiniteQuery(
      {
        limit: 8,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )
  const workspaceCount = data?.pages.reduce((acc, page) => acc + page.items.length, 0) ?? 0

  return (
    <>
      <Container className="mt-4" asChild>
        <header>
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <a href={env.DOCS_URL}>
                <ChevronLeft size={16} className="mr-1" />
                Home
              </a>
            </Button>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm text-muted-foreground">Login as {authed.user.email}</span>
              <Button size="sm" type="button" variant="ghost" onClick={authed.logout}>
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </header>
      </Container>

      <Container className="mt-40 max-w-2xl mx-auto pb-8" asChild>
        <main>
          <div className="block md:flex justify-between gap-4">
            <div>
              <Logo size={24} />
              <h1 className="font-title text-xl font-bold mt-4">Chose your workspace</h1>
              <p className="mt-2 text-muted-foreground">
                Each workspace should represent a product environment. The number of workspaces per account is unlimited
              </p>
            </div>
            <div className="min-w-max mt-6 md:mt-0">
              <CreateWorkspaceSheet>
                <Button variant="secondary" className="md:w-auto w-full">
                  <Plus size={16} className="mr-2" /> Create workspace
                </Button>
              </CreateWorkspaceSheet>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {data?.pages.map((page) =>
              page.items.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} />),
            )}
            {isLoading && (
              <>
                <WorkspaceCardSkeleton />
                <WorkspaceCardSkeleton />
                <WorkspaceCardSkeleton />
                <WorkspaceCardSkeleton />
              </>
            )}
            {isFetching && hasNextPage && <WorkspaceCardSkeleton />}
            {!isFetching && hasNextPage && <ViewportBlock onEnterViewport={() => fetchNextPage()} />}
            {isSuccess && workspaceCount === 0 && <Empty />}
            {isSuccess && !hasNextPage && workspaceCount > 0 && <End />}
            {isError && <QueryError />}
          </div>
        </main>
      </Container>
    </>
  )
}