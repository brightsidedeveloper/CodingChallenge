import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export interface User {
  id: string
  name: string
  challenger: User | null
  pending?: boolean
}

export const usernameLocalAtom = atomWithStorage<User['name']>('username', 'Player XXXX')
export const lobbyAtom = atom<Record<User['id'], User>>({})

export const challengerAtom = atom<User | null>(null)

export const gameAtom = atom<Record<string, string>>({})
