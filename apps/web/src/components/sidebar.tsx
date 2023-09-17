import { Link } from '@tanstack/react-router'
import { CheckCircle2, Circle, LayoutDashboard, MinusCircle, XCircle } from 'lucide-react'
import { env } from '~/env'
import { customerListRoute } from '~/routes/customer-list'
import { workspaceOverviewRoute } from '~/routes/workspace-overview'
import { Logo } from './logo'
import { Button } from './ui/button'

type Props = {
  workspaceId: string
}

// TODO: add links to the buttons
export function Sidebar(props: Props) {
  return (
    <div className="w-44 space-y-8">
      <Logo size={24} />

      <div>
        <Link
          to={workspaceOverviewRoute.to}
          params={{
            workspaceId: props.workspaceId,
          }}
        >
          {({ isActive }) => (
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-between mt-3"
              asChild
            >
              <div>
                <div className="flex items-center">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Overview
                </div>

                {/* TODO */}
                {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
              </div>
            </Button>
          )}
        </Link>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">Customer</span>

        <Button variant="ghost" size="sm" className="w-full justify-between mt-3" asChild>
          <Link
            to={customerListRoute.to}
            params={{
              workspaceId: props.workspaceId,
            }}
            search={{
              status: 'waiting',
            }}
            activeProps={{
              className: '!bg-secondary !text-secondary-foreground hover:!bg-secondary/80',
            }}
          >
            <div className="flex items-center">
              <Circle className="h-4 w-4 mr-2" />
              Waiting
            </div>

            {/* TODO */}
            {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
          </Link>
        </Button>

        <Link
          to={customerListRoute.to}
          params={{
            workspaceId: props.workspaceId,
          }}
          search={{
            status: 'helping',
          }}
        >
          {({ isActive }) => (
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-between mt-3"
              asChild
            >
              <div>
                <div className="flex items-center">
                  <MinusCircle className="h-4 w-4 mr-2" />
                  Helping
                </div>

                {/* TODO */}
                {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
              </div>
            </Button>
          )}
        </Link>

        <Link
          to={customerListRoute.to}
          params={{
            workspaceId: props.workspaceId,
          }}
          search={{
            status: 'helped',
          }}
        >
          {({ isActive }) => (
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-between mt-3"
              asChild
            >
              <div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Helped
                </div>

                {/* TODO */}
                {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
              </div>
            </Button>
          )}
        </Link>

        <Link
          to={customerListRoute.to}
          params={{
            workspaceId: props.workspaceId,
          }}
          search={{
            status: 'helped',
          }}
        >
          {({ isActive }) => (
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full justify-between mt-3"
              asChild
            >
              <div>
                <div className="flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  Spam
                </div>
              </div>
            </Button>
          )}
        </Link>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">Workspace</span>

        <Button variant="ghost" size="sm" className="w-full justify-start mt-3">
          <span className="h-5 w-5 mr-2 i-heroicons-cog-6-tooth" />
          Settings
        </Button>

        <Button variant="ghost" size="sm" className="w-full justify-start mt-3">
          <span className="h-5 w-5 mr-2 i-heroicons-users" />
          Members
        </Button>

        <Button variant="ghost" size="sm" className="w-full justify-start mt-3" asChild>
          <a href={env.DOCS_URL + '/todo'}>
            <span className="h-5 w-5 mr-2 i-heroicons-document-magnifying-glass" />
            Docs
          </a>
        </Button>
      </div>
    </div>
  )
}
