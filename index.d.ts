interface EventCardTypes {
  index?: number;
  user: string;
  value?: string;
  ticker: string;
  time?: string;
}
interface BondStep {
  price: bigint;
  step: bigint;
}
interface Event {
  _id: string;
  token: string;
  blockNumber: number;
  blockTimestamp: string;
  transactionHash: string;
  eventId: string;
  logIndex: number;
  user: string;
  receiver: string;
  amountMinted?: { _hex: string; _isBigNumber: boolean };
  reserveToken: string;
  reserveAmount?: { _hex: string; _isBigNumber: boolean };
  amountBurned?: { _hex: string; _isBigNumber: boolean };
  refundAmount?: { _hex: string; _isBigNumber: boolean };
  isMint: boolean;
}
interface TokenCardTypes {
  name: string;
  ticker: string;
  createdBy: string;
  marketCap?: string;
  desc: string;
  border?: boolean;
  tokenAddress?: string;
  clickedToken?: string;
  cid: string;
}

interface TradesCardType {
  user: string;
  isBuy: boolean;
  reserveAmount: string;
  memeTokenAmount: string;
  date: string;
  tx: string;
}

interface TokenInfo {
  tokenAddress: string;
  cid: string;
  tw: string;
  tg: string;
  web: string;
  desc: string;
}

interface FilteredData {
  [key: string]: {
    [innerKey: string]: string;
  };
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
