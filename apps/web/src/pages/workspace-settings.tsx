import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useNavigate, useParams } from 'react-router-dom'
import { match } from 'ts-pattern'
import { GeneralSkeleton } from '~/components/general-skeleton'
import { QueryError } from '~/components/query-error'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { SheetTrigger } from '~/components/ui/sheet'
import { useToast } from '~/components/ui/use-toast'
import { WorkspaceLeaveDialog } from '~/components/workspace-leave-dialog'
import { WorkspaceMemberInviteSheet } from '~/components/workspace-member-invite-sheet'
import { WorkspaceMemberRemoveDialog } from '~/components/workspace-member-remove-dialog'
import { WorkspaceMemberUpdateSheet } from '~/components/workspace-member-update-sheet'
import { WorkspaceUpdateSheet } from '~/components/workspace-update-sheet'
import { useAuthedStore } from '~/stores/auth'
import { trpc } from '~/utils/trpc'

export function WorkspaceSettingsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const auth = useAuthedStore()
  const params = useParams() as { workspaceId: string }

  const workspaceDetailQuery = trpc.workspace.detail.useQuery({
    workspaceId: params.workspaceId,
  })

  const [openUpdateWorkspaceSheet, setOpenUpdateWorkspaceSheet] = useState(false)

  const isAdmin = !!workspaceDetailQuery.data?.workspace.members.find(
    (member) => member.userId === auth.user.id && member.role === 'admin',
  )

  return (
    <div>
      <WorkspaceUpdateSheet
        workspaceId={params.workspaceId}
        open={openUpdateWorkspaceSheet}
        onOpenChange={setOpenUpdateWorkspaceSheet}
      />
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
                      <CopyToClipboard
                        text={query.data.workspace.id}
                        onCopy={() => {
                          toast({
                            title: 'Copied to clipboard',
                          })
                        }}
                      >
                        <Button type="button" variant="ghost" className="text-primary hover:text-primary">
                          Copy
                        </Button>
                      </CopyToClipboard>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <div className="font-medium  sm:w-64 sm:flex-none sm:pr-6">Name</div>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div>{query.data.workspace.name}</div>
                      {isAdmin && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-primary hover:text-primary"
                          onClick={() => setOpenUpdateWorkspaceSheet(true)}
                        >
                          Update
                        </Button>
                      )}
                    </dd>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-medium">Members</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Invite people to collaborate with you in this workspace.
                </p>

                <div className="mt-6 space-y-6 divide-y divide-border/60 border-t text-sm leading-6">
                  {query.data.workspace.members.map((member) => {
                    return (
                      <div key={`members:${member.userId}`} className="pt-6 sm:flex">
                        <div className="font-medium  sm:w-64 sm:flex-none sm:pr-6">{member.user.name}</div>
                        <dd className="mt-1 flex justify-between gap-x-6 gap-y-4 sm:mt-0 sm:flex-auto flex-wrap">
                          <div>{member.user.email}</div>
                          <div className="flex items-center gap-2">
                            {isAdmin && auth.user.id !== member.userId && (
                              <>
                                <WorkspaceMemberRemoveDialog workspaceId={params.workspaceId} userId={member.userId}>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    Remove
                                  </Button>
                                </WorkspaceMemberRemoveDialog>
                                <WorkspaceMemberUpdateSheet workspaceId={params.workspaceId} userId={member.userId}>
                                  <SheetTrigger asChild>
                                    <Button type="button" variant="ghost" className="text-primary hover:text-primary">
                                      Update
                                    </Button>
                                  </SheetTrigger>
                                </WorkspaceMemberUpdateSheet>
                              </>
                            )}
                          </div>
                        </dd>
                      </div>
                    )
                  })}
                </div>
                <div className="flex border-t border-gray-100 pt-6 mt-6">
                  <WorkspaceMemberInviteSheet workspaceId={params.workspaceId}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" className="text-primary hover:text-primary pl-0" type="button">
                        + Invite people
                      </Button>
                    </SheetTrigger>
                  </WorkspaceMemberInviteSheet>
                </div>
              </div>

              <div className="pt-10">
                <Card className="p-4 border-destructive">
                  <h2 className="font-medium text-destructive">Danger zone</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Please be careful with these settings. They can&apos;t be undone.
                  </p>

                  <div className="mt-6 space-y-6 divide-y divide-border/60 border-t border-border text-sm leading-6">
                    <div className="pt-6 sm:flex">
                      <div className="sm:w-64 sm:flex-none sm:pr-6">
                        Leave <span className="font-bold">{query.data.workspace.name}</span> workspace
                      </div>
                      <dd className="mt-1 flex justify-end gap-x-6 sm:mt-0 sm:flex-auto">
                        <WorkspaceLeaveDialog workspaceId={params.workspaceId} onSuccess={() => navigate('/')}>
                          <Button type="button" variant="destructive">
                            Leave
                          </Button>
                        </WorkspaceLeaveDialog>
                      </dd>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
