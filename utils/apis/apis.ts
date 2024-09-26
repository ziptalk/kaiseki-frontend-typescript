import { baseAPI } from "./customapi";
export const TxlogsMintBurn = async (
  tokenAddress: string,
  params?: {
    itemCount: number;
  },
) => {
  try {
    const response = await baseAPI.get(`TxlogsMintBurn/${tokenAddress}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.log("Error in TxlogsMintBurn API", error);
  }
};

export const HolderDistribution = async () => {
  try {
    const response = await baseAPI.get("HolderDistribution");
    return response.data;
  } catch (error) {
    console.log("Error in HolderDistribution API", error);
  }
};

export const ChangeMcap = async (data: {
  tokenAddress: string;
  marketCap: number;
}) => {
  try {
    const response = await baseAPI.put("changeMcap", data);
    return response.data;
  } catch (error) {
    console.log("Error in ChangeMcap API", error);
  }
};

export const StoreCidAndTokenAddress = async (data: {
  cid: string;
  tokenAddress: string;
  description: string;
  telegramId: string;
  twitterUrl: string;
  telegramUrl: string;
  websiteUrl: string;
  name: string;
  ticker: string;
  marketCap: number;
  createdBy: `0x${string}` | undefined;
  threshold: number;
  rafflePrize: string;
  timestamp: string;
}) => {
  try {
    const response = await baseAPI.post("StoreCidAndTokenAddress", data);
    return response.data;
  } catch (error) {
    console.log("Error in StoreCidAndTokenAddress API", error);
  }
};

export const Search = async (params: {
  keyword?: string;
  page: number;
  sort?: "createdAt" | "currentSupply";
  order?: "asc" | "desc";
}) => {
  try {
    const response = await baseAPI.get("search", { params });
    return response.data;
  } catch (error) {
    console.log("Error in Search API", error);
  }
};

export const TokensLatest = async () => {
  try {
    const response = await baseAPI.get("tokens/latest");
    return response.data;
  } catch (error) {
    console.log("Error in token/latest API", error);
  }
};

export const Raffle = async () => {
  try {
    const response = await baseAPI.get("raffle");
    return response.data;
  } catch (error) {
    console.log("Error in raffle API", error);
  }
};

export const RaffleEnter = async (data: {
  tokenAddress: string;
  userAddress: `0x${string}` | undefined;
  tokenAmount: number;
}) => {
  try {
    const response = await baseAPI.post("raffle-enter", data);
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log("Error in raffle-enter API", error);
  }
};

export const RaffleWinner = async (params: { tokenAddress: string }) => {
  try {
    params = { tokenAddress: ":" + params.tokenAddress };
    const response = await baseAPI.get("raffle-winner", { params });
    return response.data;
  } catch (error) {
    console.log("Error in raffle-winner API", error);
  }
};

export const User = async (params: { address: string }) => {
  try {
    params = { address: ":" + params.address };
    const response = await baseAPI.get("user", { params });
    return response.data;
  } catch (error) {
    console.log("Error in user API", error);
  }
};

export const RaffleTelegramId = async (data: {
  winnerAddress: `0x${string}` | undefined;
  tokenAddress: string;
  telegramId: string;
}) => {
  try {
    const response = await baseAPI.post("raffle-telegramId", data);
    return response.data;
  } catch (error) {
    console.log("Error in raffle-telegramId API", error);
  }
};

export const UsersTrades = async (userAddress: `0x${string}` | undefined) => {
  try {
    const response = await baseAPI.get(`users/${userAddress}/trades`);
    return response.data;
  } catch (error) {
    console.log("Error in users-trades API", error);
  }
};

export const UsersTotalAssets = async (
  userAddress: `0x${string}` | undefined,
) => {
  try {
    const response = await baseAPI.get(`users/${userAddress}/totalAssets`);
    return response.data;
  } catch (error) {
    console.log("Error in users-total-assets API", error);
  }
};

export const UsersMemes = async (userAddress: `0x${string}` | undefined) => {
  try {
    const response = await baseAPI.get(`users/${userAddress}/memes`);
    return response.data;
  } catch (error) {
    console.log("Error in users-memes API", error);
  }
};

export const FindTokenByAddress = async (tokenAddress: string) => {
  try {
    const response = await baseAPI.get(`findTokenByAddress/${tokenAddress}`);
    return response.data;
  } catch (error) {
    console.log("Error in find-token-by-address API", error);
  }
};
