import { nanoid } from 'nanoid'

export function generateUserId() {
  return `u_${nanoid()}`
}

export function generateWorkspaceId() {
  return `w_${nanoid()}`
}

export function generateCustomerId() {
  return `c_${nanoid()}`
}

export function generateTimelineId() {
  return `t_${nanoid()}`
}

export function generateOtp(length = 6) {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}
