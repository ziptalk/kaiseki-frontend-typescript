export interface RaffleResponse {
  result: { message: string; tokens: TokenResponse[] };
  winner: {
    message: string;
    raffles: {
      raffleEndTime: string;
      tokenAddress: string;
      winnerAddress: string;
    }[];
  };
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

export interface MyTradeResponse {
  burnEvents: {
    amountBurned: string;
    cid: string;
    refundAmount: string;
    ticker: string;
    timestamp: string;
    tokenCreator: string;
    tokenName: string;
  }[];
  mintEvents: {
    amountMinted: string;
    cid: string;
    reserveAmount: string;
    ticker: string;
    timestamp: string;
    tokenCreator: string;
    tokenName: string;
  }[];
}
