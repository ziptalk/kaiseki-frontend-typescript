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
  createdBy?: string;
  marketCap?: string;
  description: string;
  tokenAddress: string;
  clickedToken?: string;
  cid: string;
  rafflePrize?: string;

  twitterUrl?: string;
  websiteUrl?: string;
  telegramUrl?: string;

  setModal?: React.Dispatch<React.SetStateAction<boolean>>;
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
  cid: string;
  createdBy?: string;
  rafflePrize?: string;
  description: string;
  marketCap?: number;
  name: string;
  ticker: string;
  tokenAddress: string;
  setInfo?: () => void;
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
