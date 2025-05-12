import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

export function CryptoPage() {
  const { data: coins, isLoading } = useQuery({
    queryKey: ['coins'],
    queryFn: () => fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd').then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Crypto Coins</h1>
      <Link to="/github">Go to GitHub</Link>
      <ul>
        {coins?.map(coin => (
          <li key={coin.id}>
            <Link to={`/crypto/${coin.id}`}>{coin.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}