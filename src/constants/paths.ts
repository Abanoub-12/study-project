export enum Paths {
  MAIN = '/',
  REPOSITORY_DETAIL = '/repository/$repoId',
  NOT_FOUND = '/404'
}

type Pathnames = {
  [key in Paths]: string
}

export const PathsNames: Pathnames = {
  [Paths.MAIN]: 'common:pathnames.main',
  [Paths.REPOSITORY_DETAIL]: 'common:pathnames.repositoryDetail',
  [Paths.NOT_FOUND]: 'common:pathnames.notFound'
}
