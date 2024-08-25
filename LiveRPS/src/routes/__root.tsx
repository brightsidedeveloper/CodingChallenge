import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { BrightQueryDevTools, BrightWebTheme, initBrightBase } from 'bsdweb'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

initBrightBase(SUPABASE_URL, SUPABASE_ANON_KEY)

export const Route = createRootRoute({
  beforeLoad() {
    BrightWebTheme.initializeTheme()
    BrightWebTheme.mediaThemeEventListener()
    BrightWebTheme.storageThemeEventListener()
  },
  loader() {
    return { id: crypto.randomUUID() }
  },
  component: () => (
    <>
      <Outlet />
      {!import.meta.env.PROD && (
        <>
          <BrightQueryDevTools />
          <TanStackRouterDevtools />
        </>
      )}
    </>
  ),
})
