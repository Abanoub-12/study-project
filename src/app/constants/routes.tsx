/* eslint-disable react-refresh/only-export-components */
import { Paths } from 'constants/paths'
import { NotFoundRoute, Route } from '@tanstack/react-router'
import Main from 'components/pages/Main'
import NotFound from 'components/pages/NotFound'
import RepositoryDetail from 'components/pages/RepositoryDetail'
import Suspense from 'components/wrappers/Suspense/Suspense'
import { rootRoute } from './router'

const mainRoute = new Route({
  getParentRoute: () => rootRoute,
  path: Paths.MAIN,
  component: () => (
    <Suspense>
      <Main />
    </Suspense>
  )
})

const repositoryDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: Paths.REPOSITORY_DETAIL,
  component: () => (
    <Suspense>
      <RepositoryDetail />
    </Suspense>
  )
})

export const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => (
    <Suspense>
      <NotFound />
    </Suspense>
  )
})

export const routes = [mainRoute, repositoryDetailRoute]
