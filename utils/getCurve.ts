import contracts from "@/global/contracts";
import { ethers } from "ethers";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";

const { abi: MCV2_BondABI } = MCV2_BondArtifact;

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);

const bondContract = new ethers.Contract(
  contracts.MCV2_Bond,
  MCV2_BondABI,
  provider,
);

export const setCurStepsIntoState = async ({
  tokenAddress,
}: {
  tokenAddress: string;
}) => {
  try {
    // Fetch the steps using the getSteps function from the contract
    const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
    const targetPrice = await bondContract.priceForNextMint(tokenAddress);
    const detail = await bondContract.getDetail(tokenAddress);
    // console.log("targetPrice:", targetPrice);

    // Extract the step prices into a new array
    const stepPrices: bigint[] = steps.map((step) => step.price);

    for (let i = 0; i < stepPrices.length; i++) {
      if (Number(stepPrices[i]) == Number(targetPrice)) {
        return {
          curve: Math.floor(((i + 1) / stepPrices.length) * 100),
          marketCap: Number(
            ethers.formatEther(
              targetPrice *
                BigInt(
                  Number(ethers.formatEther(detail.info.currentSupply)).toFixed(
                    0,
                  ),
                ),
            ),
          ),
        };
      }
    }

    // console.log("Extracted step prices:", stepPrices);
  } catch (error: any) {
    console.error("Error:", error);
  }
};

// export const fetchTokenDetailFromContract = async ({
//   tokenAddress,
// }: {
//   tokenAddress: string;
// }) => {
//   try {
//     const detail = await bondContract.getDetail(tokenAddress);
//     console.log(detail);
//     const price = detail.info.reserveBalance;
//     const mcap = Number(ethers.formatEther(price.toString()));
//     // const response = await axios.get(
//     //   `https://api.binance.com/api/v3/ticker/price?symbol=${RESERVE_SYMBOL}USDT`,
//     // );
//     // const marketCapInUSD = (response.data.price * Number(mcap)).toFixed(0);
//     console.log(mcap);
//     await ChangeMcap({
//       tokenAddress: tokenAddress,
//       marketCap: mcap,
//     });
//     return mcap;
//   } catch (error) {
//     console.log(error);
//   }
// };
