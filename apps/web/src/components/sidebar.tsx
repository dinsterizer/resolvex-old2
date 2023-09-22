import { CheckCircle2, Circle, FileSearch, LayoutDashboard, Menu, MinusCircle, Settings, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useMatch, useSearchParams } from 'react-router-dom'
import { env } from '~/env'
import { Logo } from './logo'
import { MenuSuperDropdown } from './menu-super-dropdown'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet'

type Props = {
  workspaceId: string
}

function Nav(props: Props & { onNavigate?: () => void }) {
  const matchWorkspaceOverview = useMatch(`/${props.workspaceId}`)
  const matchCustomerList = useMatch(`/${props.workspaceId}/customers`)
  const matchWorkspaceSettings = useMatch(`/${props.workspaceId}/settings`)
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  return (
    <>
      <div>
        <Button
          variant={matchWorkspaceOverview ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-between"
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}`}>
            <div className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </div>
          </Link>
        </Button>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">Customer</span>

        <Button
          variant={matchCustomerList && status === 'waiting' ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-between mt-3"
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=waiting`}>
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

        <Button
          variant={matchCustomerList && status === 'helping' ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-between mt-3"
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=helping`}>
            <div className="flex items-center">
              <MinusCircle className="h-4 w-4 mr-2" />
              Helping
            </div>

            {/* TODO */}
            {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
          </Link>
        </Button>

        <Button
          variant={matchCustomerList && status === 'helped' ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-between mt-3"
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=helped`}>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Helped
            </div>

            {/* TODO */}
            {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
          </Link>
        </Button>

        <Button
          variant={matchCustomerList && status === 'spam' ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-between mt-3"
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=spam`}>
            <div className="flex items-center">
              <XCircle className="h-4 w-4 mr-2" />
              Spam
            </div>
          </Link>
        </Button>
      </div>

      <div>
        <span className="text-xs text-muted-foreground">Workspace</span>

        <Button
          variant={matchWorkspaceSettings ? 'secondary' : 'ghost'}
          size="sm"
          className="w-full justify-start mt-3"
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/settings`}>
            <Settings size={16} className="mr-2" />
            Settings
          </Link>
        </Button>

        <Button variant="ghost" size="sm" className="w-full justify-start mt-3" asChild>
          <a href={env.DOCS_URL + '/todo'}>
            <FileSearch size={16} className="mr-2" />
            Docs
          </a>
        </Button>
      </div>
    </>
  )
}

export function VerticalSidebar(props: Props) {
  return (
    <div className="space-y-8">
      <MenuSuperDropdown>
        <Button variant="ghost" type="button" className="justify-start" size="sm">
          <Logo size={20} />
        </Button>
      </MenuSuperDropdown>

      <Nav {...props} />
    </div>
  )
}

export function HorizontalSidebar(props: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center justify-between gap-2">
      <MenuSuperDropdown>
        <Button variant="ghost" type="button" className="justify-start" size="sm">
          <Logo size={20} />
        </Button>
      </MenuSuperDropdown>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button type="button" size="icon" variant="ghost">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <MenuSuperDropdown>
              <Button variant="ghost" type="button" className="justify-start max-w-max" size="sm">
                <Logo size={20} />
              </Button>
            </MenuSuperDropdown>
          </SheetHeader>

          <div className="space-y-8 mt-8">
            <Nav
              onNavigate={() => {
                setOpen(false)
              }}
              {...props}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
