import { GithubPage } from '../pages/GithubPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/github')({
  component: GithubPage,
});