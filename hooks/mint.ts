import contracts from "@/contracts/contracts";
import { useWriteContract } from "wagmi";
import { abi } from "../abis/MCV2_Bond.sol/MCV2_Bond.json";
const {
  writeContract,
  error,
  isPending,
  data,
  isSuccess,
  writeContractAsync,
  status,
  variables,
} = useWriteContract();

const wei = (num: number, decimals = 18): bigint => {
  return BigInt(num) * BigInt(10) ** BigInt(decimals);
};

async function mint(name: string, symbol: string) {
  const token = await writeContractAsync({
    abi,
    address: contracts.MCV2_Bond,
    functionName: "createToken",
    args: [
      { name: name, symbol: symbol },
      {
        mintRoyalty: 0,
        burnRoyalty: 0,
        reserveToken: "0x36602b7f1706200ec47a680ba929995a11cd8ab7", // Should be set later
        maxSupply: wei(10000000), // supply: 10M
        stepRanges: [
          wei(10000),
          wei(100000),
          wei(200000),
          wei(500000),
          wei(1000000),
          wei(2000000),
          wei(5000000),
          wei(10000000),
        ],
        stepPrices: [
          wei(0, 9),
          wei(2, 9),
          wei(3, 9),
          wei(4, 9),
          wei(5, 9),
          wei(7, 9),
          wei(10, 9),
          wei(15, 9),
        ],
      },
    ],
  });

  alert(token);
}

export default mint;
