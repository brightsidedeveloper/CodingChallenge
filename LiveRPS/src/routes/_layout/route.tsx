import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { challengerAtom, lobbyAtom as lobbyAtom, User, usernameLocalAtom } from '@/api/Atoms'
import useEvent from '@/hooks/BrightBaseRealtime/useEvent'
import useSubscribe from '@/hooks/BrightBaseRealtime/useSubscribe'
import { useLoaderData } from '@tanstack/react-router'
import { BrightBaseRealtime } from 'bsdweb'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

export const Route = createFileRoute('/_layout')({
  component: Lobby,
})

type LobbyEvents = {
  join: User
  leave: User
  challenge: User
  accept: User
  [id: string]: { id: string; name: string; challenger: User | null }
}

const lobby = new BrightBaseRealtime<LobbyEvents>('lobby')

function Lobby() {
  const navigate = useNavigate()
  const { id } = useLoaderData({ from: '__root__' })
  const setLobby = useSetAtom(lobbyAtom)
  const username = useAtomValue(usernameLocalAtom)
  const challenger = useAtomValue(challengerAtom)

  useSubscribe(lobby)

  useEffect(() => {
    const leave = () => {
      lobby.emit('leave', { id, name: username, challenger: null })
    }

    window.addEventListener('beforeunload', leave)

    return () => {
      window.removeEventListener('beforeunload', leave)
    }
  }, [id, username])

  useEvent(lobby, id, (challenge) => {
    setLobby((lobby) => ({ ...lobby, [id]: challenge }))
  })

  useEvent(lobby, 'join', ({ id: newID, name: newName, challenger: newChallenger }) => {
    setLobby((lobby) => ({ ...lobby, [newID]: { id: newID, name: newName, challenger: newChallenger } }))
    lobby.emit(newID, { id, name: username, challenger })
  })

  useEvent(lobby, 'leave', ({ id }) => {
    setLobby((lobby) => {
      const { [id]: _, ...rest } = lobby
      console.log('leave', _)
      return rest
    })
  })

  useEvent(lobby, 'challenge', ({ id: challengerID }) => {
    setLobby((lobby) => ({
      ...lobby,
      [challengerID]: { ...lobby[challengerID], pending: true },
    }))
  })

  useEvent(lobby, 'accept', ({ id: challengerID }) => {
    // Set each others challenger and navigate to game
    setLobby((lobby) => ({
      ...lobby,
      [challengerID]: { ...lobby[challengerID], pending: false },
    }))
  })

  useEffect(() => {
    const t = setTimeout(() => {
      const name = username || 'Player ' + id.slice(0, 4)
      const user = { id, name, challenger }
      setLobby((lobby) => ({ ...lobby, [id]: user }))
      lobby.emit('join', user)
    }, 1000)
    return () => {
      clearTimeout(t)
      lobby.emit('leave', { id, name: username, challenger })
    }
  }, [id, username, setLobby, challenger])

  return <Outlet />
}
