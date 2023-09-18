interface LogoProps {
  variant?: 'full' | 'icon'
  size?: number
}

// TODO: drop menu on click logo
export function Logo({ variant = 'full', size = 20 }: LogoProps) {
  const style = {
    width: 'auto',
    height: `${size}px`,
  }
  const src = variant === 'full' ? '/img/full-logo.svg' : '/img/icon-logo.svg'
  const alt = variant === 'full' ? 'ResolveX Full logo' : 'ResolveX Icon logo'

  return <img src={src} alt={alt} style={style} />
}
