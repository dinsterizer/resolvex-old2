import { CheckCircle2, Circle, FileSearch, LayoutDashboard, Menu, MinusCircle, Settings, XCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useMatch, useSearchParams } from 'react-router-dom'
import { env } from '~/env'
import { cn } from '~/lib/utils'
import { Logo } from './logo'
import { MenuSuperDropdown } from './menu-super-dropdown'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from './ui/sheet'

type Props = {
  workspaceId: string
  collapse?: boolean
}

function Nav(props: Props & { onNavigate?: () => void }) {
  const location = useLocation()
  const matchWorkspaceOverview = useMatch(`/${props.workspaceId}`)
  const matchCustomerList = location.pathname.startsWith(`/${props.workspaceId}/customers`)
  const matchWorkspaceSettings = useMatch(`/${props.workspaceId}/settings`)
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  return (
    <>
      <div>
        <Button
          variant={matchWorkspaceOverview ? 'secondary' : 'ghost'}
          size={props.collapse ? 'icon' : 'default'}
          className={props.collapse ? '' : 'w-full justify-between'}
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}`}>
            <div className="flex items-center">
              <LayoutDashboard
                className={cn('h-4 w-4', {
                  'mr-2': !props.collapse,
                })}
              />
              {props.collapse ? '' : 'Overview'}
            </div>
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <span
          className={cn('text-xs text-muted-foreground pl-4', {
            'opacity-0 truncate': props.collapse,
          })}
        >
          {props.collapse ? 'x' : 'Customer'}
        </span>

        <Button
          variant={matchCustomerList && status === 'waiting' ? 'secondary' : 'ghost'}
          size={props.collapse ? 'icon' : 'default'}
          className={props.collapse ? '' : 'w-full justify-between'}
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=waiting`}>
            <div className="flex items-center">
              <Circle
                className={cn('h-4 w-4', {
                  'mr-2': !props.collapse,
                })}
              />
              {props.collapse ? '' : 'Waiting'}
            </div>

            {/* TODO */}
            {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
          </Link>
        </Button>

        <Button
          variant={matchCustomerList && status === 'helping' ? 'secondary' : 'ghost'}
          size={props.collapse ? 'icon' : 'default'}
          className={props.collapse ? '' : 'w-full justify-between'}
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=helping`}>
            <div className="flex items-center">
              <MinusCircle
                className={cn('h-4 w-4', {
                  'mr-2': !props.collapse,
                })}
              />
              {props.collapse ? '' : 'Helping'}
            </div>

            {/* TODO */}
            {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
          </Link>
        </Button>

        <Button
          variant={matchCustomerList && status === 'helped' ? 'secondary' : 'ghost'}
          size={props.collapse ? 'icon' : 'default'}
          className={props.collapse ? '' : 'w-full justify-between'}
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=helped`}>
            <div className="flex items-center">
              <CheckCircle2
                className={cn('h-4 w-4', {
                  'mr-2': !props.collapse,
                })}
              />
              {props.collapse ? '' : 'Helped'}
            </div>

            {/* TODO */}
            {/* <div className="h-6 w-6 rounded-sm bg-muted-foreground/25 text-muted-foreground text-sm flex items-center justify-center">
                <span className="pt-[1px]">5</span>
              </div> */}
          </Link>
        </Button>

        <Button
          variant={matchCustomerList && status === 'spam' ? 'secondary' : 'ghost'}
          size={props.collapse ? 'icon' : 'default'}
          className={props.collapse ? '' : 'w-full justify-between'}
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/customers?status=spam`}>
            <div className="flex items-center">
              <XCircle
                className={cn('h-4 w-4', {
                  'mr-2': !props.collapse,
                })}
              />
              {props.collapse ? '' : 'Spam'}
            </div>
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <span
          className={cn('text-xs text-muted-foreground pl-4', {
            'opacity-0 truncate': props.collapse,
          })}
        >
          {props.collapse ? 'x' : 'Workspace'}
        </span>

        <Button
          variant={matchWorkspaceSettings ? 'secondary' : 'ghost'}
          size={props.collapse ? 'icon' : 'default'}
          className={props.collapse ? '' : 'w-full justify-start'}
          onClick={props.onNavigate}
          asChild
        >
          <Link to={`/${props.workspaceId}/settings`}>
            <Settings
              className={cn('h-4 w-4', {
                'mr-2': !props.collapse,
              })}
            />
            {props.collapse ? '' : 'Settings'}
          </Link>
        </Button>

        <Button
          variant="ghost"
          size={props.collapse ? 'icon' : 'default'}
          className={props.collapse ? '' : 'w-full justify-start'}
          asChild
        >
          <a href={env.DOCS_URL + '/todo'}>
            <FileSearch
              className={cn('h-4 w-4', {
                'mr-2': !props.collapse,
              })}
            />
            {props.collapse ? '' : 'Docs'}
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
        <Button
          variant="ghost"
          type="button"
          className={props.collapse ? '' : 'justify-start'}
          size={props.collapse ? 'icon' : 'default'}
        >
          <Logo variant={props.collapse ? 'icon' : 'full'} size={20} />
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
        <Button variant="ghost" type="button" className="justify-start pl-0" size="sm">
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
