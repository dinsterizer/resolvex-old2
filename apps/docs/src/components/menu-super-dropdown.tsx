import JsFileDownloader from 'js-file-downloader'
import { Code, Download, FileImage, FileSearch, Github, Home, Twitter } from 'lucide-react'
import { clientDownload } from '~/lib/download'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Props = React.ComponentPropsWithoutRef<typeof DropdownMenu>

export function MenuSuperDropdown({ children, ...props }: Props) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem asChild>
          <a href="/">
            <Home size={16} className="mr-2" />
            <span>Home</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/todo">
            <FileSearch size={16} className="mr-2" />
            <span>Docs</span>
          </a>
        </DropdownMenuItem>
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
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Download className="mr-2 h-4 w-4" />
            <span>Download Logo</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => clientDownload({ url: './/icon-logo.svg', filename: 'resolvex-icon-logo.svg' })}
              >
                <Code className="mr-2 h-4 w-4" />
                <span>Icon as SVG</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => clientDownload({ url: './/icon-logo.png', filename: 'resolvex-icon-logo.png' })}
              >
                <FileImage className="mr-2 h-4 w-4" />
                <span>Icon as PNG</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => clientDownload({ url: './/full-logo.svg', filename: 'resolvex-full-logo.svg' })}
              >
                <Code className="mr-2 h-4 w-4" />
                <span>Full as SVG</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => clientDownload({ url: './/full-logo.png', filename: 'resolvex-full-logo.png' })}
              >
                <FileImage className="mr-2 h-4 w-4" />
                <span>Full as PNG</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
