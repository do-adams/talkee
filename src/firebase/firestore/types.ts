import type { FieldValue, Timestamp } from 'firebase/firestore'

type UserId = string

/**
 * Firestore's Timestamp value is trinary:
 *   - FieldValue Sentinel value when saving to the db
 *   - Timestamp value when retrieving from the db
 *   - Null during optimistic real-time db snapshots
 *
 * Read more at: https://medium.com/firebase-developers/the-secrets-of-firestore-fieldvalue-servertimestamp-revealed-29dd7a38a82b
 */
interface CreationTimestamp {
  createdAt: FieldValue | Timestamp | null
}

export interface User extends CreationTimestamp {
  uid: UserId
  email: string | null
  isAnonymous: boolean
}

export interface Channel extends CreationTimestamp {
  creatorUid: UserId
  name: string
}

export interface Message extends CreationTimestamp {
  authorUid: UserId | null
  text: string
  audioURL: string | null
}
