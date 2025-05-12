import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div>
      <h1>Welcome to the App!</h1>
    </div>
  );
}

import { githubRoute } from './routes/github';
import { cryptoRoute } from './routes/crypto';

export const routeTree = Route.addChildren([
  githubRoute,
  cryptoRoute
]);