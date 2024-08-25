import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/game')({
  component: () => <div>Hello /game!</div>,
})
