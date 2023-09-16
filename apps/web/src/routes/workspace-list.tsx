import { Route } from '@tanstack/react-router'
import { CreateWorkspaceSheet } from '~/components/create-workspace-sheet'
import { End } from '~/components/end'
import { Logo } from '~/components/logo'
import { QueryError } from '~/components/query-error'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Container } from '~/components/ui/container'
import { ViewportBlock } from '~/components/viewport-block'
import { WorkspaceCard, WorkspaceCardSkeleton } from '~/components/workspace-cart'
import { env } from '~/env'
import { useAuthedStore } from '~/stores/auth'
import { trpc } from '~/utils/trpc'
import { rootRoute } from './_root'

export const workspaceListRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function WorkspaceListPage() {
    const authed = useAuthedStore()
    const { data, hasNextPage, isError, isSuccess, fetchNextPage, isFetching } = trpc.workspace.list.useInfiniteQuery(
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
                  <span className="i-heroicons-chevron-left mr-1" />
                  <span className="text-sm font-normal">Home</span>
                </a>
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Login as {authed.user.email}</span>
                <Button size="sm" type="button" variant="ghost" onClick={authed.logout}>
                  <span className="i-heroicons-arrow-left-on-rectangle h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            </div>
          </header>
        </Container>

        <Container className="mt-40 max-w-2xl mx-auto" asChild>
          <main>
            <div className="flex justify-between gap-4">
              <div>
                <Logo size={24} />
                <h1 className="font-title text-xl font-bold mt-4">Chose your workspace</h1>
                <p className="mt-2 text-muted-foreground">
                  Each workspace should represent a product environment. The number of workspaces per account is
                  unlimited
                </p>
              </div>
              <div className="min-w-max">
                <CreateWorkspaceSheet>
                  <Button variant="secondary">
                    <span className="i-heroicons-plus mr-2" /> Create workspace
                  </Button>
                </CreateWorkspaceSheet>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {data?.pages.map((page) =>
                page.items.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} />),
              )}
              {isFetching && <WorkspaceCardSkeleton />}
              {!isFetching && hasNextPage && <ViewportBlock onEnterViewport={() => fetchNextPage()} />}
              {isSuccess && workspaceCount === 0 && <Empty />}
              {isSuccess && !hasNextPage && workspaceCount > 0 && <End />}
              {isError && <QueryError />}
            </div>
          </main>
        </Container>
      </>
    )
  },
})

export function Empty() {
  return (
    <Card className="py-20 flex items-center justify-center">
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask
          id="mask0_7523_1278"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="300"
          height="300"
        >
          <path d="M300 0H0V300H300V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_7523_1278)">
          <path
            d="M150 269C216.274 269 270 215.274 270 149C270 82.7258 216.274 29 150 29C83.7258 29 30 82.7258 30 149C30 215.274 83.7258 269 150 269Z"
            fill="url(#paint0_linear_7523_1278)"
          />
          <g filter="url(#filter0_d_7523_1278)">
            <path
              d="M197.537 63.5564H105C96.1636 63.5564 89.0001 70.7198 89.0001 79.5564V202.585C89.0001 211.422 96.1636 218.585 105 218.585H197.537C206.374 218.585 213.537 211.422 213.537 202.585V79.5564C213.537 70.7198 206.374 63.5564 197.537 63.5564Z"
              fill="url(#paint1_linear_7523_1278)"
            />
          </g>
          <path
            d="M145.1 83.5564H104.9C102.194 83.5564 100 85.7502 100 88.4564C100 91.1626 102.194 93.3564 104.9 93.3564H145.1C147.806 93.3564 150 91.1626 150 88.4564C150 85.7502 147.806 83.5564 145.1 83.5564Z"
            fill="#3F3F46"
          />
          <path
            d="M195.1 111.356H104.9C102.194 111.356 100 113.55 100 116.256C100 118.962 102.194 121.156 104.9 121.156H195.1C197.806 121.156 200 118.962 200 116.256C200 113.55 197.806 111.356 195.1 111.356Z"
            fill="#D5D5D5"
          />
          <path
            d="M195.1 139.156H104.9C102.194 139.156 100 141.35 100 144.056C100 146.762 102.194 148.956 104.9 148.956H195.1C197.806 148.956 200 146.762 200 144.056C200 141.35 197.806 139.156 195.1 139.156Z"
            fill="#D5D5D5"
          />
          <path
            d="M195.1 166.956H104.9C102.194 166.956 100 169.15 100 171.856C100 174.562 102.194 176.756 104.9 176.756H195.1C197.806 176.756 200 174.562 200 171.856C200 169.15 197.806 166.956 195.1 166.956Z"
            fill="#D5D5D5"
          />
          <path
            d="M195.1 194.756H104.9C102.194 194.756 100 196.95 100 199.656C100 202.362 102.194 204.556 104.9 204.556H195.1C197.806 204.556 200 202.362 200 199.656C200 196.95 197.806 194.756 195.1 194.756Z"
            fill="#D5D5D5"
          />
          <g filter="url(#filter1_d_7523_1278)">
            <path
              d="M288.15 46.4241H228.069C225.27 46.4241 223 48.8126 223 51.7589V81.4781C223 84.4244 225.27 86.8129 228.069 86.8129H288.15C290.95 86.8129 293.219 84.4244 293.219 81.4781V51.7589C293.219 48.8126 290.95 46.4241 288.15 46.4241Z"
              fill="white"
            />
          </g>
          <path
            d="M238 73C241.314 73 244 70.3137 244 67C244 63.6863 241.314 61 238 61C234.686 61 232 63.6863 232 67C232 70.3137 234.686 73 238 73Z"
            fill="#CCC6D9"
          />
          <path
            d="M278 61H258C254.686 61 252 63.6863 252 67C252 70.3137 254.686 73 258 73H278C281.314 73 284 70.3137 284 67C284 63.6863 281.314 61 278 61Z"
            fill="#D5D5D5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M185.11 225.563C197.989 225.563 209.959 221.667 219.905 214.989L260.604 253.841L275.365 236.716L236.092 199.226C243.345 189.018 247.61 176.539 247.61 163.063C247.61 128.546 219.627 100.563 185.11 100.563C150.592 100.563 122.61 128.546 122.61 163.063C122.61 197.581 150.592 225.563 185.11 225.563ZM238.419 163.063C238.419 192.287 214.728 215.977 185.505 215.977C156.282 215.977 132.592 192.287 132.592 163.063C132.592 133.84 156.282 110.15 185.505 110.15C214.728 110.15 238.419 133.84 238.419 163.063Z"
            fill="#CCC6D9"
          />
          <path
            d="M185.5 217C215.6 217 240 192.823 240 163C240 133.177 215.6 109 185.5 109C155.4 109 131 133.177 131 163C131 192.823 155.4 217 185.5 217Z"
            fill="white"
            fillOpacity="0.3"
          />
          <path
            d="M194.923 163L208.112 149.862C209.348 148.562 210.025 146.835 209.999 145.047C209.974 143.259 209.248 141.552 207.976 140.287C206.704 139.023 204.986 138.301 203.187 138.276C201.388 138.251 199.65 138.923 198.342 140.151L185.124 153.289L171.935 140.151C171.3 139.484 170.537 138.95 169.691 138.58C168.845 138.211 167.933 138.014 167.009 138.001C166.085 137.988 165.168 138.159 164.312 138.504C163.456 138.85 162.678 139.362 162.024 140.012C161.371 140.661 160.855 141.434 160.508 142.285C160.16 143.136 159.988 144.048 160.001 144.967C160.014 145.885 160.212 146.791 160.584 147.632C160.955 148.473 161.493 149.231 162.165 149.862L175.376 163L162.165 176.138C161.493 176.769 160.955 177.527 160.584 178.368C160.212 179.209 160.014 180.115 160.001 181.033C159.988 181.952 160.16 182.863 160.508 183.715C160.855 184.566 161.371 185.339 162.024 185.988C162.678 186.637 163.456 187.15 164.312 187.496C165.168 187.841 166.085 188.012 167.009 187.999C167.933 187.986 168.845 187.789 169.691 187.42C170.537 187.05 171.3 186.516 171.935 185.849L185.153 172.711L198.372 185.849C199.692 187.004 201.405 187.616 203.164 187.559C204.922 187.503 206.592 186.782 207.834 185.544C209.076 184.305 209.796 182.643 209.848 180.896C209.9 179.148 209.279 177.446 208.112 176.138L194.923 163Z"
            fill="#3F3F46"
          />
          <path
            d="M260.601 253.843L275.362 236.717L277.585 238.84C279.742 240.899 281.033 243.775 281.175 246.837C281.317 249.898 280.297 252.893 278.341 255.163C276.384 257.433 273.651 258.792 270.742 258.941C267.833 259.09 264.987 258.017 262.83 255.958L260.607 253.836L260.601 253.843Z"
            fill="#E1DCEB"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M56.3144 91.1717C56.2956 89.7456 56.1167 88.3073 55.7589 86.8592C54.5042 81.7771 48.9064 78.5144 42.9484 77.7473C36.9927 76.9802 30.7993 78.7258 28.4123 83.1465C27.047 85.674 26.8587 87.8525 27.4166 89.6891C27.9721 91.5159 29.2903 93.0304 31.0793 94.2106C36.0675 97.4978 44.8034 98.169 48.7887 96.7946C50.6319 96.1578 52.4327 95.3908 54.1864 94.513C53.1836 100.259 49.4477 105.702 44.4619 110.607C33.6264 121.268 16.8117 129.36 7.65456 132.335C7.16257 132.495 6.88948 133.04 7.04249 133.554C7.19551 134.068 7.71809 134.356 8.21008 134.196C17.5485 131.162 34.6905 122.898 45.7402 112.026C51.4487 106.411 55.5164 100.089 56.2109 93.4435C69.1156 86.242 79.7134 73.1767 88.774 62.1815C89.1106 61.7758 89.0659 61.1587 88.6751 60.8071C88.2844 60.4579 87.6958 60.5022 87.3592 60.9103C78.6681 71.4556 68.5812 83.9997 56.3144 91.1717ZM54.4383 92.2166C54.509 90.6136 54.3582 88.9859 53.951 87.3435C52.8658 82.9449 47.8776 80.3437 42.72 79.6798C39.5585 79.2742 36.3077 79.6086 33.7583 80.7985C32.1552 81.546 30.8345 82.6302 30.0389 84.1055C28.9937 86.0404 28.7677 87.6951 29.1961 89.099C29.6245 90.5128 30.6887 91.6486 32.0752 92.5608C36.6208 95.5579 44.575 96.1948 48.2025 94.9433C50.3423 94.2057 52.4186 93.2861 54.4383 92.2166Z"
            fill="#3F3F46"
          />
          <path
            d="M285 190C288.314 190 291 187.314 291 184C291 180.686 288.314 178 285 178C281.686 178 279 180.686 279 184C279 187.314 281.686 190 285 190Z"
            fill="#E3E3E3"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M58.3843 225.394C59.4551 224.993 60.5819 224.459 61.4508 223.686C62.4828 222.769 62.9026 221.587 63.1845 220.343C63.5463 218.744 63.6908 217.042 64.1296 215.441C64.292 214.846 64.6047 214.621 64.7388 214.522C65.0779 214.27 65.4207 214.202 65.7432 214.228C66.1254 214.257 66.6502 214.409 66.9954 215.083C67.0447 215.18 67.1087 215.327 67.1518 215.528C67.1832 215.676 67.2035 216.137 67.2367 216.328C67.3198 216.797 67.3893 217.266 67.4545 217.737C67.6717 219.306 67.7968 220.639 68.4829 222.081C69.414 224.038 70.3468 225.235 71.6121 225.766C72.8354 226.279 74.2982 226.182 76.1671 225.78C76.345 225.735 76.5209 225.696 76.6951 225.664C77.5191 225.513 78.3068 226.082 78.4686 226.946C78.6305 227.809 78.1068 228.65 77.2902 228.84C77.1197 228.88 76.9517 228.917 76.7856 228.952C74.26 229.61 71.3363 231.958 69.6373 234.014C69.1136 234.648 68.3468 236.421 67.5646 237.551C66.9874 238.386 66.3388 238.935 65.7942 239.13C65.4293 239.261 65.1216 239.24 64.8674 239.174C64.4982 239.079 64.1917 238.868 63.9567 238.533C63.8287 238.35 63.7099 238.105 63.6533 237.791C63.6262 237.64 63.6231 237.257 63.6237 237.083C63.4643 236.506 63.2693 235.943 63.1271 235.361C62.788 233.971 62.1228 233.092 61.3326 231.93C60.5936 230.843 59.7997 230.159 58.636 229.614C58.4847 229.575 57.2631 229.26 56.8317 229.08C56.2016 228.815 55.9013 228.371 55.7923 228.132C55.6071 227.727 55.588 227.373 55.625 227.077C55.6797 226.641 55.8656 226.268 56.1954 225.967C56.3997 225.78 56.705 225.598 57.1136 225.509C57.4293 225.44 58.2668 225.4 58.3843 225.394ZM65.5505 223.13C65.6071 223.263 65.6674 223.396 65.7314 223.531C67.0951 226.397 68.6201 227.998 70.4736 228.774L70.5357 228.799C69.2957 229.768 68.1732 230.851 67.3154 231.889C66.9622 232.317 66.4946 233.205 65.9894 234.115C65.5303 232.545 64.7794 231.435 63.8354 230.045C63.1142 228.985 62.3585 228.187 61.4299 227.537C62.1505 227.148 62.8379 226.692 63.4366 226.16C64.4336 225.273 65.0926 224.246 65.5505 223.13Z"
            fill="#CCC6D9"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_7523_1278"
            x="59.0001"
            y="53.5564"
            width="184.537"
            height="215.029"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="20" />
            <feGaussianBlur stdDeviation="15" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0.19 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7523_1278" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7523_1278" result="shape" />
          </filter>
          <filter
            id="filter1_d_7523_1278"
            x="216"
            y="37.4241"
            width="96.219"
            height="66.3889"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dx="6" dy="4" />
            <feGaussianBlur stdDeviation="6.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.104618 0 0 0 0 0.465612 0 0 0 0 0.545833 0 0 0 0.09 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7523_1278" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7523_1278" result="shape" />
          </filter>
          <linearGradient
            id="paint0_linear_7523_1278"
            x1="149.075"
            y1="-10.0749"
            x2="151.533"
            y2="411.347"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F2F2F2" />
            <stop offset="1" stopColor="#EFEFEF" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_7523_1278"
            x1="151.269"
            y1="63.5564"
            x2="151.269"
            y2="218.585"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.71875" stopColor="#FAFAFA" />
          </linearGradient>
        </defs>
      </svg>
    </Card>
  )
}
