import { CheckCircle2, Circle, FileSearch, LayoutDashboard, MinusCircle, Settings, Users, XCircle } from 'lucide-react'
import { Link, useMatch, useSearchParams } from 'react-router-dom'
import { env } from '~/env'
import { Logo } from './logo'
import { Button } from './ui/button'

type Props = {
  workspaceId: string
}

export function Sidebar(props: Props) {
  const matchWorkspaceOverview = useMatch(`/${props.workspaceId}`)
  const matchCustomerList = useMatch(`/${props.workspaceId}/customers`)
  const matchWorkspaceSettings = useMatch(`/${props.workspaceId}/settings`)
  const matchWorkspaceMembers = useMatch(`/${props.workspaceId}/members`)
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')

  return (
    <div className="w-44 space-y-8">
      <Link to="/">
        <Logo size={24} />
      </Link>

      <div>
        <Link to={`/${props.workspaceId}`}>
          <Button
            variant={matchWorkspaceOverview ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-between mt-3"
            asChild
          >
            <div>
              <div className="flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Overview
              </div>
            </div>
          </Button>
        </Link>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">Customer</span>

        <Link to={`/${props.workspaceId}/customers?status=waiting`}>
          <Button
            variant={matchCustomerList && status === 'waiting' ? 'secondary' : 'ghost'}
            size="sm"
            className="w-full justify-between mt-3"
            asChild
          >
            <div>
              <div className="flex items-center">
                <Circle className="h-4 w-4 mr-2" />
                Waiting
              </div>

              {/* TODO */}
              {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
            </div>
          </Button>
        </Link>

        <Link to={`/${props.workspaceId}/customers?status=helping`}>
          <Button
            variant={matchCustomerList && status === 'helping' ? 'secondary' : 'ghost'}
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
        </Link>

        <Link to={`/${props.workspaceId}/customers?status=helped`}>
          <Button
            variant={matchCustomerList && status === 'helped' ? 'secondary' : 'ghost'}
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
        </Link>

        <Link to={`/${props.workspaceId}/customers?status=spam`}>
          <Button
            variant={matchCustomerList && status === 'spam' ? 'secondary' : 'ghost'}
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
        </Link>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">Workspace</span>

        <Button
          variant={matchWorkspaceSettings ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-start mt-3"
          asChild
        >
          <Link to={`/${props.workspaceId}/settings`}>
            <Settings size={16} className="mr-2" />
            Settings
          </Link>
        </Button>

        <Button
          variant={matchWorkspaceMembers ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-start mt-3"
          asChild
        >
          <Link to={`/${props.workspaceId}/members`}>
            <Users size={16} className="mr-2" />
            Members
          </Link>
        </Button>

        <Button variant="ghost" size="sm" className="w-full justify-start mt-3" asChild>
          <a href={env.DOCS_URL + '/todo'}>
            <FileSearch size={16} className="mr-2" />
            Docs
          </a>
        </Button>
      </div>
    </div>
  )
}
