import { CryptoPage } from '../pages/CryptoPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/crypto')({
  component: CryptoPage,
});