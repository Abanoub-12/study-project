import React from 'react'
import styles from './styles.module.scss'
import { getOrganizationRepositories, Repository } from 'api/github'
import { useQuery } from '@tanstack/react-query'
import MainLayout from 'components/layouts/MainLayout'
import MultiDropdown from 'components/ui/MultiDropdown'
import { useNavigate } from '@tanstack/react-router'

const LANGUAGES = [
  { key: 'javascript', value: 'JavaScript' },
  { key: 'typescript', value: 'TypeScript' },
  { key: 'python', value: 'Python' },
  { key: 'java', value: 'Java' },
  { key: 'csharp', value: 'C#' },
  { key: 'php', value: 'PHP' },
  { key: 'ruby', value: 'Ruby' },
  { key: 'go', value: 'Go' },
  { key: 'rust', value: 'Rust' },
  { key: 'kotlin', value: 'Kotlin' },
]

const Main = () => {
  const navigate = useNavigate()
  const [organization, setOrganization] = React.useState<string>('')
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const [selectedLanguages, setSelectedLanguages] = React.useState<typeof LANGUAGES>([])

  const { data: repositories, isLoading, error } = useQuery({
    queryKey: ['repositories', organization, selectedLanguages.map(lang => lang.key)],
    queryFn: () => getOrganizationRepositories(
      organization,
      selectedLanguages.map(lang => lang.key)
    ),
    enabled: !!organization
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOrganization(searchTerm)
  }

  const handleRepositoryClick = (repo: Repository) => {
    navigate({ to: `/repository/$repoId`, params: { repoId: repo.id.toString() }, state: { repository: repo } })
  }

  const pluralizeLanguages = (languages: typeof LANGUAGES) => {
    if (languages.length === 0) return 'Выберите языки'
    if (languages.length === 1) return languages[0].value
    return `${languages.length} языков выбрано`
  }

  return (
    <MainLayout>
      <div className={styles.mainRoot}>
        <h1>GitHub Repository Explorer</h1>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <label className={styles.formLabel}>
            Organization name
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter organization name (e.g. facebook, google, microsoft)"
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>Search</button>
          </div>
        </form>

        {organization && (
          <div className={styles.filterContainer}>
            <h2>Repositories for: {organization}</h2>
            <div style={{ maxWidth: '400px' }}>
              <label className={styles.formLabel}>
                Filter by language
              </label>
              <MultiDropdown
                options={LANGUAGES}
                value={selectedLanguages}
                onChange={setSelectedLanguages}
                pluralizeOptions={pluralizeLanguages}
              />
            </div>
          </div>
        )}

        {isLoading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading repositories...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <h3>Error loading repositories</h3>
            <p>Please check the organization name and try again.</p>
          </div>
        )}

        {repositories && repositories.length === 0 && !isLoading && (
          <div className={styles.emptyState}>
            <h3>No repositories found</h3>
            <p>
              {selectedLanguages.length > 0
                ? 'No repositories match the selected language filters.'
                : 'This organization has no public repositories or the organization does not exist.'}
            </p>
          </div>
        )}

        {repositories && repositories.length > 0 && (
          <>
            <h3>Found {repositories.length} repositories</h3>
            <div className={styles.repositoriesList}>
              {repositories.map(repo => (
                <div
                  key={repo.id}
                  className={styles.repositoryItem}
                  onClick={() => handleRepositoryClick(repo)}
                >
                  <h3>{repo.name}</h3>
                  <p>{repo.description || 'No description available'}</p>
                  <div className={styles.repositoryMeta}>
                    {repo.language && <span className={styles.language}>{repo.language}</span>}
                    <span className={styles.stars}>⭐ {repo.stars}</span>
                    <span className={styles.forks}>🍴 {repo.forks}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}

export default Main
