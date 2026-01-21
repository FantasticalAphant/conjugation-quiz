import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/charts" className="&.active]:font-bold">
          Charts
        </Link>{' '}
        <Link to="/settings" className="&.active]:font-bold">
          Settings
        </Link>
      </div>
      <hr />
      <Outlet />
      <Analytics />
      <SpeedInsights />
    </>
  ),
})
