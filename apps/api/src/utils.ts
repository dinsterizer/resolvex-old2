import { nanoid } from 'nanoid'

export function generateUserId() {
  return `u_${nanoid()}`
}
