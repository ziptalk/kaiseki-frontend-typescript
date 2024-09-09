import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { Button } from "../atoms/Button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { stepPrices, stepRanges } from "@/global/createValue";

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
  RESERVE_SYMBOL: string;
  tokenAddress: string;
}

export const Tradesection = ({
  tokenAddress,
  memeTokenSymbol,
  RESERVE_SYMBOL,
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

  const [inputValue, setInputValue] = useState("");

  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_SEPOLIA,
  );

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

  function isNumberKey(e: any) {
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  useEffect(() => {
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
    try {
      if (
        checkMetaMaskInstalled() &&
        checkAccountAddressInitialized(account.address)
      ) {
        setUserMemeTokenBalanceIntoState();
        setCurStepsIntoState();
        setPriceForNextMintIntoState();
        setUserReserveBalanceIntoState();
      }
    } catch {
      console.log("error");
    }
  }, [account?.address]);

  const subtractTenPercent = (value: any) => {
    const tenPercent = BigInt(value) / BigInt(10); // 10% 계산
    const result = BigInt(value) - tenPercent; // 10% 뺀 값 계산
    return result;
  };
  const sellhandlePercentage = (percentage: number) => {
    console.log(curMemeTokenValue, priceForNextMint);
    console.log(
      (Number(
        BigInt(parseFloat(curMemeTokenValue)) * BigInt(priceForNextMint),
      ) *
        percentage) /
        100,
    );
    if (isInputInTokenAmount) {
      const value = (parseFloat(curMemeTokenValue) * percentage) / 100;
      setInputValue(Math.floor(value).toString());
    } else {
      const value =
        (Number(
          BigInt(parseFloat(curMemeTokenValue)) / BigInt(priceForNextMint),
        ) *
          percentage) /
        100;
      setInputValue(value.toFixed(10).toString());
    }
  };
  // const buyhandlePercentage = (percentage: number) => {
  //   const value = Number(handleBuyMaxinMeme()) * (percentage / 100);
  //   setInputValue(value.toString());
  // };
  const getTotalMemetokenAmount = async () => {
    try {
      const supply = await memeTokenContract.totalSupply();
      return supply;
    } catch (error: any) {
      console.error("Error:", error);
    }
  };
  const setCurStepsIntoState = async () => {
    try {
      // Fetch the steps using the getSteps function from the contract
      const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
      // console.log("Fetched steps:", steps);
      const targetPrice = await bondContract.priceForNextMint(tokenAddress);

      // Extract the step prices into a new array
      const stepPrices: bigint[] = steps.map((step) => step.price);

      for (let i = 0; i < stepPrices.length; i++) {
        // console.log("stepPrices[i]:" + stepPrices[i]);
        // console.log("stepPrices.length:" + stepPrices.length);

        if (Number(stepPrices[i]) == Number(targetPrice)) {
          setBondingCurveProgress(((i + 1) / stepPrices.length) * 100);
        }
      }

      // console.log("Extracted step prices:", stepPrices);
    } catch (error: any) {
      console.error("Error:", error);
    }
  };
  const getMintTokenForReserve = async (curUserReserveBalance?: bigint) => {
    const reserveAmount = curUserReserveBalance
      ? curUserReserveBalance
      : ethers.parseEther(inputValue);

    let currentSupply = await getTotalMemetokenAmount(); // current total supply
    const curStep = Number(bondingCurveProgress.toFixed(0)) - 1;
    let reserveLeft = reserveAmount; // WEI
    let tokensToMint = BigInt(0);
    await setCurStepsIntoState();

    for (let i = curStep; i < stepPrices.length; i++) {
      const stepPriceI = stepPrices[i];
      const stepRangeI = stepRanges[i];
      const supplyLeft = stepRangeI - currentSupply; // WEI, price per token (in Ether) in the current step
      const supplyLeftInETH = BigInt(
        ethers.formatEther(supplyLeft).split(".")[0],
      ); // ETH

      const costPerToken = stepPriceI; // WEI, price per token (in Ether)

      if (costPerToken === BigInt(0)) continue;

      const maxTokensForReserve = reserveLeft / costPerToken; // Ether,  number of tokens that can be purchased with the remaining funds

      // Ether, Check if there is enough money to buy more than the remaining tokens in the current step
      if (maxTokensForReserve > supplyLeftInETH) {
        tokensToMint += supplyLeftInETH; // / Add all remaining tokens in the current step to the amount to tokensToMint
        reserveLeft -= supplyLeftInETH * costPerToken;
        currentSupply += supplyLeft;
      } else {
        tokensToMint += maxTokensForReserve;
        reserveLeft = BigInt(0);
        break;
      }
    }

    const ttm = BigInt(ethers.parseEther(String(tokensToMint)));
    const fee = (ttm * BigInt(1)) / BigInt(100);
    const totalTokensToMint = ttm - fee;
    const contractInputValue = ethers.parseEther(
      ethers.formatEther(totalTokensToMint).split(".")[0],
    );
    const displayValue = BigInt(
      ethers.formatEther(totalTokensToMint).split(".")[0],
    );

    return { displayValue, contractInputValue };
  };

  const handleReset = () => {
    setInputValue("0");
  };
  const handleBuyMaxInReserve = (percentage?: number) => {
    if (percentage) {
      const value = (Number(curUserReserveBalance) * percentage) / 100;
      setInputValue(value.toString().substring(0, 5));
    } else {
      setInputValue(curUserReserveBalance.substring(0, 5));
    }
  };
  const handleBuyMaxinMeme = async (percentage: number) => {
    await setUserMemeTokenBalanceIntoState();
    const res = await getMintTokenForReserve(
      ethers.parseEther(curUserReserveBalance),
    );

    setInputValue(
      (
        Math.floor(Number(String(res.displayValue)) / 100) * percentage
      ).toString(),
    );
  };

  // MARK: - Sell
  const sell = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;
    const BigIntValue = isInputInTokenAmount
      ? BigInt(wei(Number(inputValue)))
      : BigInt(wei(Math.floor(Number(inputValue)) * Number(curMemeTokenValue)));
    if (account.address == null) {
      return;
    }
    if (isPending) return;
    await setUserMemeTokenBalanceIntoState();
    if (
      ether(BigInt(Math.floor(Number(inputValue)))) > Number(curMemeTokenValue)
    ) {
      // setTradeModuleErrorMsg(
      //   `Insufficient balance : You have ${curMemeTokenValue} ${memeTokenName}`,
      // );
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
      const valueInEth = ethers.formatEther(amountETH[0].toString());
      const valueInWei = ethers.parseEther(valueInEth);

      const burnDetail = await zapWriteContract.burnToEth(
        tokenAddress,
        BigIntValue,
        0,
        account.address,
      );
      console.log("Burn detail:", burnDetail);
      // await setCurStepsIntoState();
      // setTradeModuleErrorMsg("Success");
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      console.error("Error while burning:", error);

      // setTradeModuleErrorMsg("ERR");
    }
    await setUserMemeTokenBalanceIntoState();
  };

  // MARK: - Buy
  const buy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;
    if (account.address == null) {
      // setTradeModuleErrorMsg("Connect your wallet first!");
      return;
    }

    if (isPending) return;
    if (
      BigInt(Math.floor(Number(inputValue))) * BigInt(priceForNextMint) >
      Number(ethers.parseEther(curUserReserveBalance))
    ) {
      // setTradeModuleErrorMsg(
      //   `Insufficient balance : You have ${curUserReserveBalance} ${RESERVE_SYMBOL}`,
      // );
      console.log(
        BigInt(Math.floor(Number(inputValue))),
        BigInt(priceForNextMint),
        Number(ethers.parseEther(curUserReserveBalance)),
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
      // await setCurStepsIntoState();
      // setTradeModuleErrorMsg("Success");
      setIsPending(false);
    } catch (error: any) {
      setIsPending(false);
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      console.error("Error while minting:", error);
      console.error(error);
      // setTradeModuleErrorMsg(error.code);
    }
    await setUserMemeTokenBalanceIntoState();
  };

  const setUserMemeTokenBalanceIntoState = async () => {
    try {
      if (account.address == null) {
        setCurMemeTokenValue("0");
        return;
      }
      const detail = await memeTokenContract.balanceOf(account.address);

      setCurMemeTokenValue(String(ether(detail)));
    } catch (error) {
      console.log(error);
    }
  };

  // MARK: - Get values
  const setUserReserveBalanceIntoState = async () => {
    try {
      if (account.address) {
        const balanceWei = await provider.getBalance(account.address);
        // console.log(balanceWei);
        const balanceEther = ethers.formatEther(balanceWei);
        // console.log(balanceEther);
        setCurUserReserveBalance(balanceEther);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const setPriceForNextMintIntoState = async () => {
    try {
      if (account.address == null) {
        setCurMemeTokenValue("0");
        return;
      }

      const detail = await bondContract.priceForNextMint(tokenAddress);
      setPriceForNextMint(detail);
      // console.log("NextMintPrice :" + detail);
    } catch (error) {
      console.log(error);
    }
  };

  const SellPercentageButton: FC = () => {
    const percentages = [25, 50, 75];
    return (
      <div className="flex items-center gap-2">
        {percentages.map((percentage) => (
          <button
            key={percentage}
            type="button"
            className="flex items-center justify-center rounded-[4px] bg-[#454545] px-2 py-1 text-[12px] text-[#AEAEAE]"
            onClick={
              () =>
                isBuy
                  ? isInputInTokenAmount
                    ? handleBuyMaxinMeme(percentage)
                    : handleBuyMaxInReserve(percentage)
                  : sellhandlePercentage(percentage)
              // ? buyhandlePercentage(percentage)
              // : sellhandlePercentage(percentage)
            }
          >
            {percentage}%
          </button>
        ))}
      </div>
    );
  };
  const BuySellButtonSection: FC = () => {
    return (
      <div className="flex h-[50px] justify-between gap-[5px]">
        <Button
          className={`h-full flex-1 ${!isBuy && "bg-[#454545]"}`}
          onClick={() => setIsBuy(true)}
        >
          Buy
        </Button>
        <Button
          className={`h-full flex-1 ${isBuy && "bg-[#454545]"}`}
          onClick={() => {
            setIsBuy(false);
            setIsInputInTokenAmount(true);
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

      <div
        onClick={() => {
          setIsInputInTokenAmount(!isInputInTokenAmount);
          handleReset();
        }}
        className={`mt-5 flex w-32 cursor-pointer items-center justify-center rounded-[4px] bg-[#454545] p-1 text-[12px] text-[#AEAEAE]`}
      >
        Switch to {isInputInTokenAmount ? "ETH" : memeTokenSymbol}
      </div>

      {isInputInTokenAmount ? (
        <>
          <div className="relative flex w-full items-center">
            <input
              className="my-[8px] h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-[#454545] px-[20px] text-[#FFFFFF]"
              type="number"
              placeholder="Enter the amount"
              step="0.01"
              name="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
              {/* <div className="h-[24px] w-[24px] overflow-hidden  rounded-full">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                alt="img"
              />
            </div>
            <h1 className="mt-1 text-[15px] font-bold text-white">
              {memeTokenSymbol}
            </h1> */}
              <button
                type="button"
                onClick={() => {
                  if (isInputInTokenAmount) {
                    handleBuyMaxinMeme(100);
                  } else {
                    handleBuyMaxInReserve();
                  }
                }}
                className="flex h-[30px] w-[52px] items-center justify-center rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] px-[8px] text-sm text-white"
              >
                MAX
              </button>
            </div>
          </div>
          {/* <h1 className="text-[#B8B8B8]">
          {ether(
            BigInt(Math.floor(Number(inputValue))) *
              BigInt(priceForNextMint),
          )}
          &nbsp;{RESERVE_SYMBOL}
        </h1> */}
        </>
      ) : (
        <>
          {/*input amount == RESERVE_SYMBOL*/}
          <div className="relative flex w-full items-center">
            <input
              className="my-[8px] h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-[#454545] px-[20px] text-[#FFFFFF]"
              type="number"
              placeholder="Enter the amount"
              step="0.01"
              name="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
              <div className="h-[24px] w-[24px] rounded-full">
                <Image src="/icons/SeiLogo.svg" alt="" height={24} width={24} />
              </div>

              <h1 className="mt-1 text-[15px] font-bold text-white">
                {RESERVE_SYMBOL}
              </h1>
            </div>
          </div>
          {/* <h1 className="text-[#B8B8B8]"> */}
          {/*RESERVE_SYMBOL value to memetoken*/}
          {/* {inputValue &&
              Number(
                String(
                  Math.floor(
                    Number(
                      ethers.parseEther(inputValue) / BigInt(priceForNextMint),
                    ),
                  ),
                ),
              )}
            &nbsp;{memeTokenSymbol}
          </h1> */}
        </>
      )}
      <SellPercentageButton />
      {/*true == toggle module, false == percent for sell*/}
      {/* {raffle && (
        <div className="text-[14px] text-white">
          {"Raffle has already progressed! -> "}
          <Link href={"#"} className="underline">
            Join the Raffle!
          </Link>
        </div>
      )} */}
      {isConnected ? (
        <Button submit className="mt-5 h-12" variant="gradiant">
          Place Trade
        </Button>
      ) : (
        <Button
          onClick={openConnectModal}
          className="mt-5 h-12"
          variant="gradiant"
        >
          Connect Wallet
        </Button>
      )}
    </form>
  );
};
