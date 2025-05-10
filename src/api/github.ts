import { Repository } from '../models/common';

export interface Repository {
    id: number;
    name: string;
    description: string;
    language: string;
    stars: number;
    watchers: number;
    forks: number;
    open_issues: number;
    url: string;
}

export interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
}

export interface ContributionDay {
    date: string;
    count: number;
}

export const getRepositoriesByLanguage = async (language?: string | string[]): Promise<Repository[]> => {
    try {
        const languageQuery = Array.isArray(language) && language.length > 0
            ? language.map(lang => `language:${lang}`).join('+')
            : typeof language === 'string' && language
                ? `language:${language}`
                : '';

        const response = await fetch(`https://api.github.com/search/repositories?q=${languageQuery}&sort=stars&order=desc`);
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }
        const data = await response.json();
        return data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            language: item.language,
            stars: item.stargazers_count,
            watchers: item.watchers_count,
            forks: item.forks_count,
            open_issues: item.open_issues_count,
            url: item.html_url
        }));
    } catch (error) {
        console.error('Error fetching repositories:', error);
        throw error;
    }
};

export const getOrganizationRepositories = async (organization: string, language?: string | string[]): Promise<Repository[]> => {
    try {
        if (!organization) {
            return [];
        }

        const response = await fetch(`https://api.github.com/orgs/${organization}/repos?per_page=100`);
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const data = await response.json();
        let repositories = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            language: item.language,
            stars: item.stargazers_count,
            watchers: item.watchers_count,
            forks: item.forks_count,
            open_issues: item.open_issues_count,
            url: item.html_url
        }));

        // Filter by language if specified
        if (language) {
            const languagesArray = Array.isArray(language) ? language : [language];
            if (languagesArray.length > 0) {
                repositories = repositories.filter(repo =>
                    repo.language && languagesArray.includes(repo.language.toLowerCase())
                );
            }
        }

        return repositories;
    } catch (error) {
        console.error('Error fetching organization repositories:', error);
        throw error;
    }
};

export const getRepositoryContributors = async (owner: string, repo: string): Promise<Contributor[]> => {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`);
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.map((item: any) => ({
            id: item.id,
            login: item.login,
            avatar_url: item.avatar_url,
            contributions: item.contributions,
            html_url: item.html_url
        }));
    } catch (error) {
        console.error('Error fetching repository contributors:', error);
        throw error;
    }
};

// Simulated function for contributions activity (GitHub API doesn't provide yearly activity in one call)
export const getRepositoryContributions = async (owner: string, repo: string): Promise<ContributionDay[]> => {
    try {
        // In a real implementation, we would need to use GitHub's statistics API
        // or scrape the contributions graph from the repository page
        // For this exercise, we'll generate mock data

        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const contributions: ContributionDay[] = [];
        let currentDate = new Date(oneYearAgo);

        while (currentDate <= today) {
            const count = Math.floor(Math.random() * 10); // Random contribution count between 0-9
            contributions.push({
                date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
                count
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return contributions;
    } catch (error) {
        console.error('Error fetching repository contributions:', error);
        throw error;
    }
};