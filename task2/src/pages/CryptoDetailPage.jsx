import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';

export function CryptoDetailPage() {
  const { coinId } = useParams();
  
  const { data: coinData, isLoading } = useQuery({
    queryKey: ['coin', coinId],
    queryFn: () => fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`).then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{coinData?.name}</h1>
      <Link to="/crypto">Back to Coins</Link>
      <p>Price: ${coinData?.market_data?.current_price?.usd}</p>
      <p>Market Cap: ${coinData?.market_data?.market_cap?.usd}</p>
      <p>24h Change: {coinData?.market_data?.price_change_percentage_24h}%</p>
    </div>
  );
}