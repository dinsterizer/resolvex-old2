import { ArrowDownUp, CreditCard, FileSearch, Github, LogOut, Settings, Twitter } from 'lucide-react'
import { Link } from 'react-router-dom'
import { env } from '~/env'
import { useAuthStore } from '~/stores/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Props = React.ComponentPropsWithoutRef<typeof DropdownMenu>

export function MenuSuperDropdown({ children, ...props }: Props) {
  const auth = useAuthStore()

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {auth.user && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/">
                <ArrowDownUp size={16} className="mr-2" />
                <span>Switch workspace</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <a href="https://github.com/divndev/resolvex">
            <Github className="mr-2 h-4 w-4" />
            <span>Github</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="https://x.com/divndev">
            <Twitter className="mr-2 h-4 w-4" />
            <span>Twitter</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={env.DOCS_URL + '/todo'}>
            <FileSearch className="mr-2 h-4 w-4" />
            <span>Docs</span>
          </a>
        </DropdownMenuItem>
        {auth.user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => auth.logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
