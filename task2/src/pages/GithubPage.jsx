import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

export function GithubPage() {
  const { data: repos, isLoading } = useQuery({
    queryKey: ['repos'],
    queryFn: () => fetch('https://api.github.com/orgs/{org}/repos').then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>GitHub Repositories</h1>
      <Link to="/crypto">Go to Crypto</Link>
      <ul>
        {repos?.map(repo => (
          <li key={repo.id}>
            <Link to={`/github/${repo.name}`}>{repo.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}