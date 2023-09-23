import { Md5 } from 'ts-md5'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

type Props = {
  user: {
    name: string
    email: string
  }
  size?: number
}

export function UserAvatar({ user, size = 20 }: Props) {
  return (
    <Avatar style={{ width: size, height: size }}>
      <AvatarImage
        src={`https://www.gravatar.com/avatar/${Md5.hashStr(user.email)}?s=20&default=404`}
        alt={`Member ${user.name}`}
      />
      <AvatarFallback className="text-[10px]">{user.name[0] ?? 'A'}</AvatarFallback>
    </Avatar>
  )
}
