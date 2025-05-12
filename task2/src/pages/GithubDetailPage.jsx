import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';

export function GithubDetailPage() {
  const { repo } = useParams();
  
  const { data: repoData, isLoading } = useQuery({
    queryKey: ['repo', repo],
    queryFn: () => fetch(`https://api.github.com/repos/{org}/${repo}`).then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{repoData?.name}</h1>
      <Link to="/github">Back to Repositories</Link>
      <p>{repoData?.description}</p>
      <p>Stars: {repoData?.stargazers_count}</p>
      <p>Forks: {repoData?.forks_count}</p>
    </div>
  );
}