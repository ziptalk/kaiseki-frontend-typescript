export interface RaffleResponse {
  message: string;
  tokens: TokenResponse[];
  timestamp: string;
}

export interface TokenResponse {
  cid: string;
  rafflePrize: string;
  token: string;
  name: string;
  symbol: string;
  creator: string;
  description: string;
  startDate: string;
}
