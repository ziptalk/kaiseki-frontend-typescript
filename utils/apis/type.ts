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

export interface TokenAllInfo {
  RaffleStatus: string;
  cid: string;
  createdAt: string;
  creator: string;
  currentSupply: string;
  decimals: number;
  description: string;
  marketCap: number;
  maxSupply: number;
  name: string;
  priceForNextMint: { $numberDecimal: string };
  raffleEndTime: string;
  rafflePrize: string;
  raffleStartTime: string;
  reserveBalance: { $numberDecimal: string };
  reserveName: string;
  reserveSymbol: string;
  reserveToken: string;
  symbol: string;
  telegramUrl: string;
  threshold: number;
  timestamp: string;
  tokenAddress: string;
  twitterUrl: string;
  websiteUrl: string;
  ticker: string;
  _id: string;
}

export const TokenInfoInit: TokenAllInfo = {
  RaffleStatus: "",
  cid: "",
  createdAt: "",
  creator: "",
  currentSupply: "",
  decimals: 0,
  description: "",
  marketCap: 0,
  maxSupply: 0,
  name: "",
  priceForNextMint: { $numberDecimal: "" },
  raffleEndTime: "",
  rafflePrize: "",
  raffleStartTime: "",
  reserveBalance: { $numberDecimal: "" },
  reserveName: "",
  reserveSymbol: "",
  reserveToken: "",
  symbol: "",
  telegramUrl: "",
  threshold: 0,
  timestamp: "",
  tokenAddress: "",
  twitterUrl: "",
  websiteUrl: "",
  ticker: "",
  _id: "",
};
