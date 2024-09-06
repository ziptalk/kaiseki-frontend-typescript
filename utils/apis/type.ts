export interface RaffleResponse {
  message: string;
  tokens: [
    {
      cid: string;
      marketCap: string;
      token: string;
      name: string;
      symbol: string;
      creator: string;
      startDate: string;
    },
  ];
  timestamp: string;
}

export interface TokenResponse {
  cid: string;
  marketCap: string;
  token: string;
  name: string;
  symbol: string;
  creator: string;
  startDate: string;
}
