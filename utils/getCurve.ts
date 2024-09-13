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
    // console.log("targetPrice:", targetPrice);

    // Extract the step prices into a new array
    const stepPrices: bigint[] = steps.map((step) => step.price);

    for (let i = 0; i < stepPrices.length; i++) {
      if (Number(stepPrices[i]) == Number(targetPrice)) {
        console.log(i, stepPrices[i]);
        return Math.floor(((i + 1) / stepPrices.length) * 100);
      }
    }

    // console.log("Extracted step prices:", stepPrices);
  } catch (error: any) {
    console.error("Error:", error);
  }
};
