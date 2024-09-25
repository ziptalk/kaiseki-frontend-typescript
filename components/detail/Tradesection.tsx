import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "../atoms/Button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { stepRanges } from "@/global/createValue";
import { RESERVE_SYMBOL } from "@/global/projectConfig";

import { ErrorDecoder } from "ethers-decode-error";
import { ethers } from "ethers";

import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import MCV2_ZapArtifact from "@/abis/MCV2_ZapV1.sol/MCV2_ZapV1.json";

import { ether, wei } from "@/utils/weiAndEther";
import { useEthersSigner } from "@/utils/ethersSigner";
import contracts from "@/global/contracts";
interface TradesectionProps {
  memeTokenSymbol: string;
  tokenAddress: string;
  cid: string;
}

export const Tradesection = ({
  tokenAddress,
  memeTokenSymbol,
  cid,
}: TradesectionProps) => {
  const account = useAccount();
  const signer = useEthersSigner();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [isBuy, setIsBuy] = useState(true);
  const [isInputInTokenAmount, setIsInputInTokenAmount] = useState(true);
  const [curMemeTokenValue, setCurMemeTokenValue] = useState("0");
  const [isPending, setIsPending] = useState(false);
  const [curUserReserveBalance, setCurUserReserveBalance] = useState("0");
  const [priceForNextMint, setPriceForNextMint] = useState(0);
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [steps, setSteps] = useState<BigInt[]>([]);

  const [inputValue, setInputValue] = useState<string>("");

  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);

  const { abi: MCV2_TokenABI } = MCV2_TokenArtifact;
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const { abi: MCV2_ZapABI } = MCV2_ZapArtifact;
  const errorDecoder = ErrorDecoder.create([MCV2_ZapABI]);

  const memeTokenContract = new ethers.Contract(
    tokenAddress,
    MCV2_TokenABI,
    provider,
  );

  const bondWriteContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    signer,
  );

  const zapWriteContract = new ethers.Contract(
    contracts.MCV2_ZapV1,
    MCV2_ZapABI,
    signer,
  );

  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  const memeTokenWriteContract = new ethers.Contract(
    tokenAddress,
    MCV2_TokenABI,
    signer,
  );

  const checkMetaMaskInstalled = () => {
    if (!window.ethereum) {
      return false;
    }
    return true;
  };

  const checkAccountAddressInitialized = (address: any) => {
    if (!address) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    setInputValue("");
    try {
      if (
        // checkMetaMaskInstalled() &&
        checkAccountAddressInitialized(account.address)
      ) {
        setUserMemeTokenBalanceIntoState();
        setCurStepsIntoState();
        setPriceForNextMintIntoState();
        setUserReserveBalanceIntoState();
        getBondSteps();
      }
    } catch {
      console.log("error");
    }
  }, [account?.address, tokenAddress]);

  const getBondSteps = async () => {
    try {
      const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
      const stepPrices: bigint[] = steps.map((step) => step.price);
      setSteps(stepPrices);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setInputValue("");
  };

  const subtractTenPercent = (value: any) => {
    const tenPercent = BigInt(value) / BigInt(10); // 10% 계산
    const result = BigInt(value) - tenPercent; // 10% 뺀 값 계산
    return result;
  };

  const sellhandlePercentage = (percentage?: number) => {
    if (!isConnected) {
      alert("Please connect your wallet");
      return;
    }

    if (percentage === 0) {
      setInputValue("");
      return;
    } else if (percentage) {
      const value = (Math.floor(Number(curMemeTokenValue)) * percentage) / 100;
      setInputValue(Math.floor(value).toString());
    } else {
      setInputValue(curMemeTokenValue);
    }
  };
  // const buyhandlePercentage = (percentage: number) => {
  //   const value = Number(handleBuyMaxinMeme()) * (percentage / 100);
  //   setInputValue(value.toString());
  // };
  const getTotalMemetokenAmount = async () => {
    try {
      const supply = await memeTokenContract.totalSupply();
      return supply || BigInt(0);
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  const setCurStepsIntoState = async () => {
    try {
      const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
      const targetPrice = await bondContract.priceForNextMint(tokenAddress);
      const stepPrices: bigint[] = steps.map((step) => step.price);
      for (let i = 0; i < stepPrices.length; i++) {
        if (Number(stepPrices[i]) == Number(targetPrice)) {
          setBondingCurveProgress(((i + 1) / stepPrices.length) * 100);
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  const getMintTokenForReserve = async (curUserReserveBalance?: bigint) => {
    const reserveAmount = curUserReserveBalance
      ? curUserReserveBalance
      : ethers.parseEther(inputValue || "0");

    let currentSupply = await getTotalMemetokenAmount(); // current total supply
    const curStep =
      Number(bondingCurveProgress.toFixed(0)) - 1 >= 0
        ? Number(bondingCurveProgress.toFixed(0)) - 1
        : 0;
    let reserveLeft = reserveAmount; // WEI
    let tokensToMint = BigInt(0);
    for (let i = curStep; i < stepRanges.length; i++) {
      const stepPriceI = steps[i];
      const stepRangeI = stepRanges[i] || BigInt(0); // WEI, total supply in the current step
      const supplyLeft = stepRangeI - currentSupply; // WEI, price per token (in Ether) in the current step
      const supplyLeftInETH = BigInt(
        ethers.formatEther(supplyLeft).split(".")[0],
      ); // ETH

      const costPerToken = stepPriceI; // WEI, price per token (in Ether)

      if (costPerToken === BigInt(0)) continue;

      const maxTokensForReserve = Math.floor(
        Number(reserveLeft) / Number(costPerToken),
      ); // Ether,  number of tokens that can be purchased with the remaining funds

      // Ether, Check if there is enough money to buy more than the remaining tokens in the current step
      if (maxTokensForReserve > supplyLeftInETH) {
        tokensToMint += supplyLeftInETH; // / Add all remaining tokens in the current step to the amount to tokensToMint
        reserveLeft -= BigInt(
          Math.floor(Number(supplyLeftInETH) * Number(costPerToken)),
        );
        currentSupply += supplyLeft;
      } else {
        tokensToMint += BigInt(maxTokensForReserve || 0);
        reserveLeft = BigInt(0);
        break;
      }
    }

    const ttm = BigInt(ethers.parseEther(String(tokensToMint)));
    const fee = reserveLeft ? BigInt(0) : (ttm * BigInt(1)) / BigInt(100);
    const totalTokensToMint = ttm - fee;
    const contractInputValue = ethers.parseEther(
      ethers.formatEther(totalTokensToMint).split(".")[0],
    );
    const displayValue = BigInt(
      ethers.formatEther(totalTokensToMint).split(".")[0],
    );

    return { displayValue, contractInputValue };
  };

  const handleBuyMaxinMeme = async (percentage?: number) => {
    if (!isConnected) {
      alert("Please connect your wallet");
      return;
    }
    await setUserMemeTokenBalanceIntoState();
    const res = await getMintTokenForReserve(
      ethers.parseEther(curUserReserveBalance),
    );
    // setMaxBuyAmount(Number(String(res.displayValue)));
    // console.log("res.displayValue :" + res.displayValue);
    if (res.displayValue <= BigInt(0)) {
      setInputValue("0");
    } else if (percentage) {
      setInputValue(
        ((Number(String(res.displayValue)) * percentage) / 100).toFixed(),
      );
    } else {
      setInputValue(String(res.displayValue));
    }
  };

  // MARK: - Sell
  const sell = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue === "" || inputValue === "0") {
      alert("Please enter the amount");
      return;
    }
    const BigIntValue = BigInt(wei(Number(inputValue)));
    if (account.address == null) {
      return;
    }
    if (isPending) return;
    await setUserMemeTokenBalanceIntoState();
    if (BigInt(Math.floor(Number(inputValue))) > Number(curMemeTokenValue)) {
      alert(
        `Insufficient balance: You have ${curMemeTokenValue} ${memeTokenSymbol}`,
      );
      return;
    }

    console.log("start-app");

    try {
      setIsPending(true);
      const approveAmount = await memeTokenContract.allowance(
        account.address,
        contracts.MCV2_ZapV1,
      );
      console.log(approveAmount, BigIntValue);
      if (approveAmount < BigIntValue) {
        console.log("Approving token...");
        // setTradeModuleErrorMsg("Approving token...");

        const approveDetail = await memeTokenWriteContract.approve(
          contracts.MCV2_ZapV1,
          BigIntValue,
        );
        const approveReceipt = await approveDetail.wait();
        console.log("Approval detail:", approveReceipt);
      }

      console.log("Burning token...");
      // setTradeModuleErrorMsg("Burning token...");
      const amountETH = await bondWriteContract.getRefundForTokens(
        tokenAddress,
        BigIntValue,
      );
      // const valueInEth = ethers.formatEther(amountETH[0].toString());
      // const valueInWei = ethers.parseEther(valueInEth);

      const burnDetail = await zapWriteContract.burnToEth(
        tokenAddress,
        BigIntValue,
        0,
        account.address,
      );
      console.log("Burn detail:", burnDetail);
      alert("Trade successful, check your wallet");
      // await setCurStepsIntoState();
      // setTradeModuleErrorMsg("Success");
      window.location.reload();
    } catch (error) {
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      if (decodedError.name === "CALL_EXCEPTION") {
        alert("You don't have enough balance");
      } else if (decodedError.name === "ACTION_REJECTED") {
        alert("User rejected the transaction");
      }
      console.error("Error while burning:", error);

      // setTradeModuleErrorMsg("ERR");
    }
    setIsPending(false);
  };

  // MARK: - Buy
  const buy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (account.address == null) {
      // setTradeModuleErrorMsg("Connect your wallet first!");
      return;
    }

    if (isPending) return;
    console.log(
      BigInt(Math.floor(Number(inputValue))),
      BigInt(priceForNextMint),
      Number(ethers.parseEther(curUserReserveBalance)),
    );
    if (
      BigInt(Math.floor(Number(inputValue))) * BigInt(priceForNextMint) >
      Number(ethers.parseEther(curUserReserveBalance))
    ) {
      // setTradeModuleErrorMsg(
      //   `Insufficient balance : You have ${curUserReserveBalance} ${RESERVE_SYMBOL}`,
      // );
      alert(
        `Insufficient balance: You have ${curUserReserveBalance} ${RESERVE_SYMBOL}`,
      );
      return;
    }

    try {
      setIsPending(true);
      const inputInToken = BigInt(ethers.parseEther(inputValue));
      const inputInReserve = subtractTenPercent(
        ethers.parseEther(
          String(
            Math.floor(
              Number(ethers.parseEther(inputValue) / BigInt(priceForNextMint)),
            ),
          ),
        ),
      );

      console.log("inputInToken :" + inputInToken);
      console.log("inputInReserve :" + inputInReserve);

      console.log("Minting token...");
      // setTradeModuleErrorMsg("Minting token...");

      const amountETH = await bondWriteContract.getReserveForToken(
        tokenAddress,
        isInputInTokenAmount ? inputInToken : inputInReserve,
      );

      const valueInEth = ethers.formatEther(amountETH[0].toString());
      const valueInWei = ethers.parseEther(valueInEth);
      const mintDetail = await zapWriteContract.mintWithEth(
        tokenAddress,
        isInputInTokenAmount ? inputInToken : inputInReserve,
        account.address,
        {
          value: valueInWei.toString(),
        },
      );

      console.log("Mint detail:", mintDetail);
      alert("Trade successful, check your wallet");
      // await setCurStepsIntoState();
      // setTradeModuleErrorMsg("Success");
      window.location.reload();
    } catch (error: any) {
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      if (decodedError.name === "ACTION_REJECTED") {
        alert("User rejected the transaction");
      } else if (decodedError.type === "CustomError") {
        alert("This Token is Ended");
      } else {
        alert("Unknown error");
      }
      console.error("Error while minting:", error);
      console.error(error);
    }
    setIsPending(false);
  };

  const setUserMemeTokenBalanceIntoState = async () => {
    try {
      if (account.address == null) {
        setCurMemeTokenValue("0");
        return;
      }
      const detail = await memeTokenContract.balanceOf(account.address);
      // console.log("detail :" + detail);

      setCurMemeTokenValue(ether(detail).toFixed());
    } catch (error) {
      console.log(error);
    }
  };

  // MARK: - Get values
  const setUserReserveBalanceIntoState = async () => {
    try {
      if (isConnected) {
        const balanceWei = await provider.getBalance(account.address || "");
        // console.log({ balanceWei });
        const balanceEther = ethers.formatEther(balanceWei);
        // console.log({ balanceEther });
        setCurUserReserveBalance(balanceEther);
      } else {
        setCurUserReserveBalance("0");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setPriceForNextMintIntoState = async () => {
    try {
      if (account.address == null) {
        setCurMemeTokenValue("");
        return;
      }

      const detail = await bondContract.priceForNextMint(tokenAddress);
      setPriceForNextMint(detail);
      // console.log("NextMintPrice :" + detail);
    } catch (error) {
      console.error(error);
    }
  };

  const EthSetButton = () => {
    const eths = [
      { name: "reset", eth: 0 },
      { name: "+ 0.01 ETH", eth: 0.01 },
      { name: "+ 0.1 ETH", eth: 0.1 },
      { name: "+ 1 ETH", eth: 1 },
    ];
    return (
      <div className="flex items-center gap-2">
        {eths.map((eth, i) => (
          <button
            key={i}
            type="button"
            className="flex items-center justify-center rounded-[4px] bg-[#454545] px-2 py-1 text-[12px] text-[#AEAEAE]"
            onClick={() => {
              if (eth.eth === 0) {
                setInputValue("");
                return;
              }
              setInputValue((Number(inputValue) + eth.eth).toFixed(10));
            }}
          >
            {eth.name}
          </button>
        ))}
      </div>
    );
  };
  const SellPercentageButton: FC = () => {
    const percentages = [0, 25, 50, 75];
    return (
      <div className="flex items-center gap-2">
        {percentages.map((percentage) => (
          <button
            key={percentage}
            type="button"
            className="flex items-center justify-center rounded-[4px] bg-[#454545] px-2 py-1 text-[12px] text-[#AEAEAE]"
            onClick={
              () => {
                if (isBuy) {
                  if (percentage === 0) {
                    setInputValue("");
                  } else {
                    handleBuyMaxinMeme(percentage);
                  }
                } else {
                  if (percentage === 0) {
                    setInputValue("");
                  } else {
                    sellhandlePercentage(percentage);
                  }
                }
              }
              // ? buyhandlePercentage(percentage)
              // : sellhandlePercentage(percentage)
            }
          >
            {percentage === 0 ? "reset" : percentage + "%"}
          </button>
        ))}
      </div>
    );
  };
  const BuySellButtonSection: FC = () => {
    return (
      <div className="flex h-10 justify-between gap-[5px] md:h-[50px]">
        <Button
          className={`h-full flex-1 ${!isBuy && "bg-[#454545]"}`}
          onClick={() => {
            setIsBuy(true);
            setInputValue("");
          }}
        >
          Buy
        </Button>
        <Button
          className={`h-full flex-1 ${isBuy && "bg-[#454545]"}`}
          onClick={() => {
            setIsBuy(false);
            setIsInputInTokenAmount(true);
            setInputValue("");
          }}
        >
          Sell
        </Button>
      </div>
    );
  };
  return (
    <form onSubmit={isBuy ? buy : sell} className="flex flex-col">
      <BuySellButtonSection />

      {isBuy ? (
        <div
          onClick={() => {
            setIsInputInTokenAmount(!isInputInTokenAmount);
            handleReset();
          }}
          className={`mt-5 flex w-32 cursor-pointer items-center justify-center rounded-[4px] bg-[#454545] p-1 text-[12px] text-[#AEAEAE]`}
        >
          Switch to {isInputInTokenAmount ? "ETH" : "$" + memeTokenSymbol}
        </div>
      ) : (
        <div className="h-5"></div>
      )}

      {isInputInTokenAmount ? (
        <>
          <div className="relative flex w-full items-center">
            <input
              className="my-[10px] h-[50px] w-full rounded border border-[#5C5C5C] bg-[#454545] px-[50px] text-[#FFFFFF] md:rounded-[10px]"
              type="number"
              placeholder="Enter the amount"
              name="inputValue"
              // step={1}
              value={inputValue}
              onChange={(e) => {
                setInputValue(Number(e.target.value).toFixed());
                if (e.target.value === "0") {
                  setInputValue("");
                }
              }}
            />
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
              alt=""
              height={30}
              width={30}
              className="absolute left-2 h-[30px] w-[30px] rounded-full"
            />
            <div className="absolute right-2 flex items-center gap-[5px]">
              <button
                type="button"
                onClick={() => {
                  if (isBuy) {
                    handleBuyMaxinMeme();
                  } else {
                    sellhandlePercentage();
                  }
                }}
                className="flex h-[30px] w-[52px] items-center justify-center rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] px-[8px] text-sm text-white"
              >
                MAX
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/*input amount == RESERVE_SYMBOL*/}
          <div className="relative flex w-full items-center">
            <input
              className="my-[10px] h-[50px] w-full rounded border border-[#5C5C5C] bg-[#454545] px-[50px] text-[#FFFFFF] md:rounded-[10px]"
              type="number"
              placeholder="Enter the amount"
              name="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="absolute left-2 h-[30px] w-[30px] rounded-full">
              <Image src="/icons/eth_base.svg" alt="" height={30} width={30} />
            </div>

            <div className="absolute right-2 flex items-center gap-[5px]">
              <button
                type="button"
                onClick={() => {
                  if (isConnected)
                    setInputValue(curUserReserveBalance.substring(0, 10));
                  else alert("Please connect your wallet");
                }}
                className="flex h-[30px] w-[52px] items-center justify-center rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] text-sm text-white"
              >
                MAX
              </button>
            </div>
          </div>
        </>
      )}
      {isBuy ? (
        isInputInTokenAmount ? (
          <SellPercentageButton />
        ) : (
          <EthSetButton />
        )
      ) : (
        <SellPercentageButton />
      )}
      {isConnected ? (
        <Button submit className="mt-5 h-12" variant="gradiant">
          {isPending ? (
            <Image
              src="/icons/Loading.svg"
              alt="loading Icon"
              height={24}
              width={24}
              className="animate-spin"
            />
          ) : (
            "Place Trade"
          )}
        </Button>
      ) : (
        <Button
          onClick={openConnectModal}
          className="mt-5 h-12"
          variant="default"
        >
          Connect Wallet
        </Button>
      )}
    </form>
  );
};
