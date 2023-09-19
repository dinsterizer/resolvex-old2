import { useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { GeneralSkeleton } from '~/components/general-skeleton'
import { QueryError } from '~/components/query-error'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { trpc } from '~/utils/trpc'

export function WorkspaceSettingsPage() {
  const params = useParams() as { workspaceId: string }
  const workspaceDetailQuery = trpc.workspace.detail.useQuery({
    workspaceId: params.workspaceId,
  })
  return (
    <div>
      <h1 className="font-title text-xl font-medium p-4">Settings</h1>

      <div className="p-4 space-y-16">
        {match(workspaceDetailQuery)
          .with({ status: 'loading' }, () => <GeneralSkeleton count={5} />)
          .with({ status: 'error' }, () => <QueryError />)
          .with({ status: 'success' }, (query) => (
            <>
              <div>
                <h2 className="font-medium">Workspace info</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This information will be displayed publicly so be careful what you share.
                </p>

                <div className="mt-6 space-y-6 divide-y divide-border/60 border-t text-sm leading-6">
                  <div className="pt-6 sm:flex">
                    <div className="font-medium sm:w-64 sm:flex-none sm:pr-6">ID</div>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div>{query.data.workspace.id}</div>
                      {/* TODO */}
                      <Button variant="ghost">Update</Button>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <div className="font-medium  sm:w-64 sm:flex-none sm:pr-6">Name</div>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div>{query.data.workspace.name}</div>
                      {/* TODO */}
                      <Button variant="ghost">Update</Button>
                    </dd>
                  </div>
                </div>
              </div>

              <Card className="p-4 border-destructive">
                <h2 className="font-medium text-destructive">Danger zone</h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Please be careful with these settings. They can&apos;t be undone.
                </p>

                <div className="mt-6 space-y-6 divide-y divide-border/60 border-t border-border text-sm leading-6">
                  <div className="pt-6 sm:flex">
                    <div className="sm:w-64 sm:flex-none sm:pr-6">
                      Leave <span className="font-bold">{query.data.workspace.name}</span> workspace
                    </div>
                    <dd className="mt-1 flex justify-end gap-x-6 sm:mt-0 sm:flex-auto">
                      {/* TODO */}
                      <Button variant="destructive">Leave</Button>
                    </dd>
                  </div>
                </div>
              </Card>
            </>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
