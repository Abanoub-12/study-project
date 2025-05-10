import AppLayout from 'app/AppLayout'
import { notFoundRoute, routes } from './routes'
import { RootRoute, Router } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const rootRoute = new RootRoute({
  component: () => (
    <>
      <AppLayout />
      {process.env.NODE_ENV !== 'production' && <TanStackRouterDevtools />}
    </>
  )
})

const routeTree = rootRoute.addChildren(routes)

export const router = new Router({
  routeTree,
  basepath: '/',
  defaultErrorComponent: ({ error }) => (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  )
})
