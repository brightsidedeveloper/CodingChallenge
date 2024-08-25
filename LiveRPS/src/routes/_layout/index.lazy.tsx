import { lobbyAtom, usernameLocalAtom } from '@/api/Atoms'
import { Button } from '@/components/ui/shadcn/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/shadcn/ui/card'
import { Input } from '@/components/ui/shadcn/ui/input'
import { Label } from '@/components/ui/shadcn/ui/label'
import { createLazyFileRoute, useLoaderData } from '@tanstack/react-router'
import { useAtom, useAtomValue } from 'jotai'

export const Route = createLazyFileRoute('/_layout/')({
  component: Lobby,
})

function Lobby() {
  const { id } = useLoaderData({ from: '__root__' })

  const users = useAtomValue(lobbyAtom)

  return (
    <>
      <header className="border-b p-4">
        <h1 className="text-primary text-5xl font-semibold text-center">T_RACK_TOE</h1>
      </header>
      <main className="p-4 flex flex-col gap-4">
        <PlayerCard />
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.values(users)
            .filter(({ id: cID }) => cID !== id)
            .map(({ id, name }) => (
              <ChallengerCard key={id} name={name} />
            ))}
        </section>
      </main>
    </>
  )
}

function PlayerCard() {
  const { id } = useLoaderData({ from: '__root__' })

  const [username, setUsername] = useAtom(usernameLocalAtom)
  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-semibold">{username || 'Player ' + id.slice(0, 4)}</h2>
      </CardHeader>
      <CardContent>
        <Label>Username</Label>
        <Input value={username ?? ''} onChange={(e) => setUsername(e.target.value)} />
      </CardContent>
    </Card>
  )
}

function ChallengerCard({ name }: { name: string }) {
  return (
    <Card className="">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Challenger</h2>
      </CardHeader>
      <CardContent>{name}</CardContent>
      <CardFooter>
        <Button className="ml-auto">Challenge</Button>
      </CardFooter>
    </Card>
  )
}
