import type { FieldValue } from 'firebase/firestore'

type UserId = string

interface Timestamp {
  createdAt: FieldValue | string
}

export interface Channel extends Timestamp {
  creatorUid: UserId
  name: string
  members: Array<UserId>
}

export interface Message extends Timestamp {
  authorUid: UserId | null
  text: string
  audioURL: string
}

export interface User extends Timestamp {
  uid: UserId
  email: string | null
  isAnonymous: boolean
}
