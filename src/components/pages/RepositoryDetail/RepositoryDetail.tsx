import React from 'react'
import { useMatch, Link } from '@tanstack/react-router'
import MainLayout from 'components/layouts/MainLayout'
import styles from './styles.module.scss'
import { Repository, getRepositoryContributors, getRepositoryContributions, Contributor, ContributionDay } from 'api/github'
import { useQuery } from '@tanstack/react-query'

const ContributionsCalendar = ({ contributions }: { contributions: ContributionDay[] }) => {
    // Group contributions by week
    const weeks: ContributionDay[][] = []
    let currentWeek: ContributionDay[] = []

    contributions.forEach((day, index) => {
        currentWeek.push(day)
        if ((index + 1) % 7 === 0) {
            weeks.push(currentWeek)
            currentWeek = []
        }
    })

    // Add the last week if it's not complete
    if (currentWeek.length > 0) {
        weeks.push(currentWeek)
    }

    // Function to determine color intensity based on count
    const getColorIntensity = (count: number) => {
        if (count === 0) return styles.emptyDay
        if (count < 3) return styles.lowActivity
        if (count < 6) return styles.mediumActivity
        return styles.highActivity
    }

    return (
        <div className={styles.contributionsCalendar}>
            <div className={styles.calendarGrid}>
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className={styles.week}>
                        {week.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                className={`${styles.day} ${getColorIntensity(day.count)}`}
                                title={`${day.date}: ${day.count} contributions`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.calendarLegend}>
                <div className={styles.legendItem}>
                    <span>Less</span>
                    <div className={styles.legendCells}>
                        <div className={`${styles.legendCell} ${styles.emptyDay}`} />
                        <div className={`${styles.legendCell} ${styles.lowActivity}`} />
                        <div className={`${styles.legendCell} ${styles.mediumActivity}`} />
                        <div className={`${styles.legendCell} ${styles.highActivity}`} />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    )
}

const Contributors = ({ contributors }: { contributors: Contributor[] }) => {
    return (
        <div className={styles.contributors}>
            {contributors.map(contributor => (
                <a
                    key={contributor.id}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contributor}
                    title={`${contributor.login} (${contributor.contributions} contributions)`}
                >
                    <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className={styles.contributorAvatar}
                    />
                </a>
            ))}
        </div>
    )
}

const RepositoryDetail = () => {
    const {
        params: { repoId },
        state
    } = useMatch('/repository/$repoId')

    const repository: Repository = state?.repository

    // Extract owner and repo name from the repository URL
    const getOwnerAndRepo = () => {
        if (!repository) return { owner: '', repo: '' }

        const urlParts = repository.url.split('/')
        const repo = urlParts.pop() || ''
        const owner = urlParts.pop() || ''

        return { owner, repo }
    }

    const { owner, repo } = getOwnerAndRepo()

    const { data: contributors, isLoading: isLoadingContributors } = useQuery({
        queryKey: ['contributors', owner, repo],
        queryFn: () => getRepositoryContributors(owner, repo),
        enabled: !!owner && !!repo
    })

    const { data: contributions, isLoading: isLoadingContributions } = useQuery({
        queryKey: ['contributions', owner, repo],
        queryFn: () => getRepositoryContributions(owner, repo),
        enabled: !!owner && !!repo
    })

    if (!repository) {
        return (
            <MainLayout>
                <div className={styles.errorContainer}>
                    <h2>Repository not found</h2>
                    <p>The repository you're looking for doesn't exist or couldn't be loaded.</p>
                    <Link to="/" className={styles.backButton}>
                        Return to search
                    </Link>
                </div>
            </MainLayout>
        )
    }

    return (
        <div className={styles.container}>
            <Link to="/" className={styles.backButton}>
                ← Back to repositories
            </Link>

            <div className={styles.header}>
                <h1>{repository.name}</h1>
                <a
                    href={repository.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                >
                    View on GitHub
                </a>
            </div>

            <div className={styles.stats}>
                {repository.language && (
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Language:</span>
                        <span className={styles.language}>{repository.language}</span>
                    </div>
                )}
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Stars:</span>
                    <span>⭐ {repository.stars}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Watchers:</span>
                    <span>👁️ {repository.watchers}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Forks:</span>
                    <span>🍴 {repository.forks}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Open Issues:</span>
                    <span>🔴 {repository.open_issues}</span>
                </div>
            </div>

            {repository.description && (
                <div className={styles.description}>
                    <h2>Description</h2>
                    <p>{repository.description}</p>
                </div>
            )}

            <div className={styles.section}>
                <h2>Contributions</h2>
                {isLoadingContributions ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading contributions data...</p>
                    </div>
                ) : contributions ? (
                    <ContributionsCalendar contributions={contributions} />
                ) : (
                    <p className={styles.emptyState}>No contributions data available</p>
                )}
            </div>

            <div className={styles.section}>
                <h2>Contributors</h2>
                {isLoadingContributors ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading contributors...</p>
                    </div>
                ) : contributors && contributors.length > 0 ? (
                    <Contributors contributors={contributors} />
                ) : (
                    <p className={styles.emptyState}>No contributors data available</p>
                )}
            </div>
        </div>
    )
}

export default RepositoryDetail 