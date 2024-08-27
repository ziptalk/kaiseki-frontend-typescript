"use client";
import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ErrorDecoder } from "ethers-decode-error";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import Image from "next/image";

import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import MCV2_ZapArtifact from "@/abis/MCV2_ZapV1.sol/MCV2_ZapV1.json";
import BondingCurveCard from "@/components/detail/BondingCurveCard";
import SocialLinkCard from "@/components/detail/SocialLinkCard";
import TradesCard from "@/components/detail/TradesCard";
import TokenCard from "@/components/common/TokenCard";

import { impact } from "@/fonts/font";
import { ether, wei } from "@/utils/weiAndEther";
import { useEthersSigner } from "@/utils/ethersSigner";
import { MAX_INT_256, BILLION } from "@/global/constants";
import contracts from "@/global/contracts";

import TradingViewChart from "@/components/common/TradingViewWidget";
import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";
import axios from "axios";

export default function Detail() {
  const signer = useEthersSigner();
  const pathname = usePathname();
  const account = useAccount();

  const tokenAddress: any = pathname.startsWith("/")
    ? pathname.slice(1)
    : pathname;

  // MARK: - init ethers.js
  const { abi: MCV2_TokenABI } = MCV2_TokenArtifact;
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const { abi: MCV2_ZapABI } = MCV2_ZapArtifact;
  const errorDecoder = ErrorDecoder.create([MCV2_ZapABI]);
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_SEPOLIA,
  );

  const bondContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
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

  const memeTokenContract = new ethers.Contract(
    tokenAddress,
    MCV2_TokenABI,
    provider,
  );

  const memeTokenWriteContract = new ethers.Contract(
    tokenAddress,
    MCV2_TokenABI,
    signer,
  );

  const [memeTokenName, setMemeTokenName] = useState("Name");
  const [memeTokenSymbol, setMemeTokenSymbol] = useState("ticker");
  const [creator, setCreator] = useState("Me");
  const [tw, setTw] = useState("");
  const [tg, setTg] = useState("");
  const [web, setWeb] = useState("");
  const [desc, setDesc] = useState("");
  const [cid, setCid] = useState(
    "QmT9jVuYbem8pJpMVtcEqkFRDBqjinEsaDtm6wz9R8VuKC",
  );
  const [TXLogsFromServer, setTXLogsFromServer] = useState<any[] | null>(null);
  const [distribution, setDistribution] = useState<FilteredData | undefined>(
    undefined,
  );
  const [TXLogs20FromServer, setTXLogs20FromServer] = useState<any[] | null>(
    null,
  );

  const [curMemeTokenValue, setCurMemeTokenValue] = useState("0");
  const [curUserReserveBalance, setCurUserReserveBalance] = useState("0");
  const [priceForNextMint, setPriceForNextMint] = useState(0);
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [marketCap, setMarketCap] = useState("");

  const [isBuy, setIsBuy] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [tradeModuleErrorMsg, setTradeModuleErrorMsg] = useState("");
  const [isInputInTokenAmount, setIsInputInTokenAmount] = useState(true);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchHolderDistributionFromServer();
      fetchTXLogsFromServer(
        tokenAddress,
        setTXLogsFromServer,
        TXLogsFromServer,
      );
      fetch20TXLogsFromServer(
        tokenAddress,
        setTXLogs20FromServer,
        TXLogsFromServer,
      );
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTokenDetailFromContract();
    setUserMemeTokenBalanceIntoState();
    fetchHomeTokenInfoFromServer(
      tokenAddress,
      setCid,
      setTw,
      setTg,
      setWeb,
      setDesc,
    );
  }, []);

  // listen event later
  useEffect(() => {
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
    } catch {}
  }, [account?.address]);

  const updateMarketCapToServer = async (tokenAddress: any, marketCap: any) => {
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/changeMcap`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenAddress: tokenAddress,
          marketCap: marketCap,
        }),
      });
      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHolderDistributionFromServer = async () => {
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/HolderDistribution`);
      const data = await response.json();
      const filteredData = filterDataByOuterKey(data, tokenAddress);
      setDistribution(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTokenDetailFromContract = async () => {
    try {
      const detail = await bondContract.getDetail(tokenAddress);
      const price = detail.info.priceForNextMint;
      // console.log("currentSupply :" + detail.info.currentSupply);
      setMemeTokenName(detail.info.name);
      setMemeTokenSymbol(detail.info.symbol);
      setCreator(detail.info.creator);
      const mcap = (
        Number(ethers.formatEther(price.toString())) * BILLION
      ).toFixed(2);
      // console.log("this is mcap" + mcap);
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${RESERVE_SYMBOL}USDT`,
      );
      const marketCapInUSD = (response.data.price * Number(mcap)).toFixed(0);

      await updateMarketCapToServer(tokenAddress, marketCapInUSD);
      setMarketCap(marketCapInUSD);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchHomeTokenInfoFromServer = async (
    tokenAddress: any,
    setCid: any,
    setTw: any,
    setTg: any,
    setWeb: any,
    setDesc: any,
  ) => {
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/homeTokenInfo`);
      const data = await response.json();
      const filteredData = data.filter(
        (item: any) => item.tokenAddress === tokenAddress,
      );
      if (filteredData.length > 0) {
        setCid(filteredData[0].cid);
        setTw(filteredData[0].twitterUrl);
        setTg(filteredData[0].telegramUrl);
        setWeb(filteredData[0].websiteUrl);
        setDesc(filteredData[0].description);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTXLogsFromServer = async (
    tokenAddress: any,
    setEventsFromDB: any,
    eventsFromDB: any,
  ) => {
    try {
      const response = await fetch(
        `${SERVER_ENDPOINT}/TxlogsMintBurn/${tokenAddress}`,
      );
      const data = await response.json();
      const filteredData = filterEventsByToken(data);
      if (filteredData.length !== eventsFromDB?.length) {
        setEventsFromDB(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetch20TXLogsFromServer = async (
    tokenAddress: any,
    setEventsFromDB: any,
    eventsFromDB: any,
  ) => {
    try {
      const response = await fetch(
        `${SERVER_ENDPOINT}/TxlogsMintBurn/${tokenAddress}?itemCount=20`,
      );
      const data = await response.json();
      const filteredData = filterEventsByToken(data);
      if (filteredData.length !== eventsFromDB?.length) {
        setEventsFromDB(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const setUserMemeTokenBalanceIntoState = async () => {
    try {
      if (account.address == null) {
        setCurMemeTokenValue("0");
        return;
      }
      const detail = await memeTokenContract.balanceOf(account.address);
      // console.log(detail);

      setCurMemeTokenValue(String(ether(detail)));
    } catch (error) {
      console.log(error);
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

  const setPriceForNextMintIntoState = async () => {
    try {
      if (account.address == null) {
        setCurMemeTokenValue("0");
        return;
      }

      const detail = await bondContract.priceForNextMint(tokenAddress);
      setPriceForNextMint(detail);
      console.log("NextMintPrice :" + detail);
    } catch (error) {
      console.log({ setPriceForNextMintIntoState: error });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleReset = () => {
    setInputValue("0");
  };

  const handlePercentage = (percentage: number) => {
    const value = (parseFloat(curMemeTokenValue) * percentage) / 100;
    setInputValue(value.toString());
  };

  const handleBuyMaxInReserve = () => {
    setInputValue(curUserReserveBalance.substring(0, 5));
  };

  const handleBuyMaxinMeme = async () => {
    await setPriceForNextMintIntoState();
    await setUserMemeTokenBalanceIntoState();
    const userMaxAmountInMeme = String(
      Math.floor(
        Number(
          ethers.parseEther(curUserReserveBalance) / BigInt(priceForNextMint),
        ),
      ),
    );

    setInputValue(userMaxAmountInMeme);
  };

  const subtractTenPercent = (value: any) => {
    const tenPercent = BigInt(value) / BigInt(10); // 10% 계산
    const result = BigInt(value) - tenPercent; // 10% 뺀 값 계산
    return result;
  };

  // MARK: - Buy
  const buy = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;
    if (account.address == null) {
      alert("Connect your wallet first!");
      setTradeModuleErrorMsg("Connect your wallet first!");
      return;
    }

    if (isPending) return;

    if (
      BigInt(Math.floor(Number(inputValue))) * BigInt(priceForNextMint) >
      Number(ethers.parseEther(curUserReserveBalance))
    ) {
      setTradeModuleErrorMsg(
        `Insufficient balance : You have ${curUserReserveBalance} ${RESERVE_SYMBOL}`,
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
      setTradeModuleErrorMsg("Minting token...");

      // const sp = stepPrices800();
      // const divValue = Math.floor(
      //   Number(totalMintAmount / BigInt(1000000000000000000000000)),
      // );
      // console.log("TMA" + totalMintAmount);
      // const additionalStep = InputState
      //   ? (BigInt(sp[divValue]) - BigInt(priceForNextMint)) * inputInToken
      //   : (BigInt(sp[divValue]) - BigInt(priceForNextMint)) * inputInReserve;

      // console.log("ADS" + additionalStep);

      const amountETH = await bondWriteContract.getReserveForToken(
        tokenAddress,
        isInputInTokenAmount ? inputInToken : inputInReserve,
      );

      const valueInEth = ethers.formatEther(amountETH[0].toString());
      const valueInWei = ethers.parseEther(valueInEth);
      // const valueInWei = ethers.parseEther(valueInEth) + additionalStep;
      // console.log("VIW BF" + ethers.parseEther(valueInEth));
      // console.log("VIW AF" + valueInWei);

      // const mintDetail = await bondWriteContract.mint(
      //   tokenAddress,
      //   isInputInTokenAmount ? inputInToken : inputInReserve,
      //   MAX_INT_256,
      //   account.address,
      //   {
      //     value: valueInWei.toString(),
      //   },
      // );

      const mintDetail = await zapWriteContract.mintWithEth(
        tokenAddress,
        isInputInTokenAmount ? inputInToken : inputInReserve,
        account.address,
        {
          value: valueInWei.toString(),
        },
      );

      console.log("Mint detail:", mintDetail);
      await setCurStepsIntoState();
      setTradeModuleErrorMsg("Success");
      setIsPending(false);
    } catch (error: any) {
      setIsPending(false);
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      console.error("Error while minting:", error);
      console.error(error);
      setTradeModuleErrorMsg(error.code);
    }
    await setUserMemeTokenBalanceIntoState();
  };

  // MARK: - Sell
  const sell = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;
    if (account.address == null) {
      alert("Connect your wallet first!");
      return;
    }
    if (isPending) return;
    await setUserMemeTokenBalanceIntoState();
    if (
      ether(BigInt(Math.floor(Number(inputValue)))) > Number(curMemeTokenValue)
    ) {
      setTradeModuleErrorMsg(
        `Insufficient balance : You have ${curMemeTokenValue} ${memeTokenName}`,
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
      console.log(approveAmount, BigInt(wei(Number(inputValue))));
      if (approveAmount < BigInt(wei(Number(inputValue)))) {
        console.log("Approving token...");
        setTradeModuleErrorMsg("Approving token...");

        const approveDetail = await memeTokenWriteContract.approve(
          contracts.MCV2_ZapV1,
          BigInt(wei(Number(inputValue))),
        );
        const approveReceipt = await approveDetail.wait();
        console.log("Approval detail:", approveReceipt);
      }

      console.log("Burning token...");
      setTradeModuleErrorMsg("Burning token...");
      const amountETH = await bondWriteContract.getRefundForTokens(
        tokenAddress,
        BigInt(wei(Number(inputValue))),
      );
      const valueInEth = ethers.formatEther(amountETH[0].toString());
      const valueInWei = ethers.parseEther(valueInEth);

      const burnDetail = await zapWriteContract.burnToEth(
        tokenAddress,
        BigInt(wei(Number(inputValue))),
        0,
        account.address,
      );
      console.log("Burn detail:", burnDetail);
      await setCurStepsIntoState();
      setTradeModuleErrorMsg("Success");
      setIsPending(false);
    } catch (error) {
      setIsPending(false);
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      console.error("Error while burning:", error);

      setTradeModuleErrorMsg("ERR");
    }
    await setUserMemeTokenBalanceIntoState();
  };

  const filterEventsByToken = (data: any): Event[] => {
    try {
      const filteredMintEvents = data.mintEvents.map((event: any) => ({
        ...event,
        isMint: true,
      }));

      const filteredBurnEvents = data.burnEvents.map((event: any) => ({
        ...event,
        isMint: false,
      }));

      const combinedEvents = [...filteredMintEvents, ...filteredBurnEvents];
      combinedEvents.sort(
        (a, b) =>
          new Date(b.blockTimestamp).getTime() -
          new Date(a.blockTimestamp).getTime(),
      );

      return combinedEvents;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const transformToTradesCardType = (event: any): TradesCardType => {
    return {
      user: event.user.substring(0, 6),
      isBuy: event.isMint,
      reserveAmount: event.reserveAmount
        ? (
            Math.ceil(Number(ethers.formatEther(event.reserveAmount)) * 10000) /
            10000
          )
            .toFixed(4)
            .toString()
        : (
            Math.ceil(Number(ethers.formatEther(event.refundAmount)) * 10000) /
            10000
          )
            .toFixed(4)
            .toString(),

      memeTokenAmount: event.amountMinted
        ? Number(ethers.formatEther(event.amountMinted)).toFixed(0).toString()
        : ethers.formatEther(event.amountBurned),
      date: event.blockTimestamp.toString(),
      tx: event.transactionHash,
    };
  };

  //MARK: - Set Distribution
  const filterDataByOuterKey = (data: any, targetOuterKey: string) => {
    if (targetOuterKey in data) {
      return { [targetOuterKey]: data[targetOuterKey] };
    }
    return {};
  };

  const TradesSection: FC = () => {
    return (
      <>
        <h1 className="mt-[30px] text-xl font-bold text-white">Trades</h1>
        <div className="mb-20 mt-[15px] gap-[20px] rounded-[10px] bg-[#1A1A1A]  p-[30px]">
          <div className="flex w-full justify-between border-b border-[#6A6A6A] px-[10px] pb-[15px] text-[#6A6A6A]">
            <h1 className="w-1/6">account</h1>
            <h1 className="w-1/6">buy / sell</h1>
            <h1 className="w-1/6">{RESERVE_SYMBOL}</h1>
            <h1 className="w-1/6">{memeTokenSymbol}</h1>
            <h1 className="w-1/6">date</h1>
            <h1 className="flex w-1/6 flex-row-reverse">transaction</h1>
          </div>
          {TXLogs20FromServer ? (
            TXLogs20FromServer.map((event) => {
              const cardProps = transformToTradesCardType(event);
              return <TradesCard key={event._id} {...cardProps} />;
            })
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </>
    );
  };

  const BuySellButtonSection: FC = () => {
    return (
      <>
        <div className="flex gap-[10px] rounded-[10px] border-2 border-[#880400] bg-black p-[10px]">
          <button
            className={`h-[44px] w-full rounded-[8px]  ${impact.variable} font-impact ${isBuy ? " border-[#43FF4B] bg-white shadow-[0_0px_10px_rgba(0,0,0,0.5)] shadow-[#43FF4B]" : " border-[#4E4B4B] bg-[#4E4B4B]"} border-2 `}
            onClick={() => setIsBuy(true)}
          >
            Buy
          </button>
          <button
            className={`h-[44px] w-full rounded-[8px] border-2 ${impact.variable} font-impact ${isBuy ? " border-[#4E4B4B] bg-[#4E4B4B]" : "border-[#FB30FF] bg-white shadow-[0_0px_10px_rgba(0,0,0,0.5)] shadow-[#FB30FF]"}`}
            onClick={() => {
              setIsBuy(false);
              setIsInputInTokenAmount(true);
            }}
          >
            Sell
          </button>
        </div>
      </>
    );
  };

  const HolderDistributionSection: FC = () => {
    return (
      <>
        <div className="mt-[70px] h-[560px] w-[420px] rounded-[10px] bg-[#1A1A1A] p-[30px]">
          <h1 className="font-bold text-[#ADADAD]">Holder distribution</h1>
          <div className="mt-[20px] gap-[8px] text-[#6A6A6A]">
            {distribution ? (
              Object.entries(distribution).map(
                ([outerKey, innerObj], index) => (
                  <div key={outerKey}>
                    {Object.entries(innerObj).map(
                      ([innerKey, value], innerIndex) => (
                        <div key={innerKey} className="flex justify-between">
                          <div className="flex">
                            <h1>{`${innerIndex + 1}. ${innerKey.substring(0, 6)}`}</h1>
                            {innerKey === contracts.MCV2_Bond && (
                              <h1>&nbsp;💳 (bonding curve)</h1>
                            )}
                            {innerKey == creator && <h1>&nbsp;🛠️ (dev)</h1>}
                          </div>

                          <h1>{`${parseFloat(value)}%`}</h1>
                        </div>
                      ),
                    )}
                  </div>
                ),
              )
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </>
    );
  };

  const SellPercentageButton: FC = () => {
    const percentages = [25, 50, 75, 100];

    return (
      <>
        <h1 className="mt-[15px] text-sm text-white">{tradeModuleErrorMsg}</h1>
        <div className="my-[15px] flex h-[20px] gap-[7px] text-[13px]">
          <button
            type="button"
            className="rounded-[4px] bg-[#202020] px-[8px] text-[#A8A8A8]"
            onClick={handleReset}
          >
            reset
          </button>
          {percentages.map((percentage) => (
            <button
              key={percentage}
              type="button"
              className="rounded-[4px] bg-[#202020] px-[8px] text-[#A8A8A8]"
              onClick={() => handlePercentage(percentage)}
            >
              {percentage}%
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <main className="flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto flex h-full w-full justify-between px-[5vw] pt-[60px]">
          <div className="w-[60vw]">
            <div className="mr-10 flex h-[245px] items-center justify-between bg-[#1A1A1A] px-[20px] py-[30px]">
              <div className="h-full w-[40%]">
                <TokenCard
                  cid={cid}
                  name={memeTokenName}
                  ticker={memeTokenSymbol}
                  cap={marketCap}
                  createdBy={creator.substring(0, 6)}
                  desc={desc}
                  tokenAddress=""
                  border={true}
                />
              </div>

              <SocialLinkCard tw={tw} tg={tg} web={web} />

              <BondingCurveCard prog={Math.floor(bondingCurveProgress)} />
            </div>
            <div className="mr-10 mt-[20px] flex h-[420px] gap-[20px]">
              <TradingViewChart tokenAddress={tokenAddress} />
            </div>
            <div className="mr-10">
              <TradesSection />
            </div>
          </div>
          <div>
            <div className=" w-[420px] rounded-[15px] border border-[#FAFF00] bg-gradient-to-b from-[#E00900] to-[#A60D07] p-[30px] shadow-[0_0px_10px_rgba(0,0,0,0.5)] shadow-[#FFF100]">
              <BuySellButtonSection />
              <form onSubmit={isBuy ? buy : sell} className="flex flex-col">
                {/*<div className="flex justify-between">
                 <div />
                   <div
                    className="mt-[15px]
                   flex h-[30px] w-[128px] cursor-pointer items-center justify-center rounded-lg bg-black text-sm text-[#A7A7A7]"
                  >
                    Set max slippage
                  </div> 
                </div>
                */}
                {isInputInTokenAmount ? (
                  <>
                    {/*input amount == memetoken*/}
                    <div className="relative flex w-full items-center">
                      <input
                        className="my-[8px] h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-black px-[20px] text-[#FFFFFF]"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        name="inputValue"
                        value={inputValue}
                        onChange={handleInputChange}
                      ></input>
                      <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
                        <div className="h-[24px] w-[24px] overflow-hidden  rounded-full">
                          <img
                            src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                            alt="img"
                          />
                        </div>
                        <h1 className="mt-1 text-[15px] font-bold text-white">
                          {memeTokenSymbol}
                        </h1>
                      </div>
                    </div>
                    <h1 className="text-[#B8B8B8]">
                      {/* {curMemeTokenValue}&nbsp; */}
                      {/* {name} */}
                      {/*memetoken value to RESERVE_SYMBOL*/}
                      {ether(
                        BigInt(Math.floor(Number(inputValue))) *
                          BigInt(priceForNextMint),
                      )}
                      &nbsp;{RESERVE_SYMBOL}
                    </h1>
                  </>
                ) : (
                  <>
                    {/*input amount == RESERVE_SYMBOL*/}
                    <div className="relative flex w-full items-center">
                      <input
                        className="my-[8px] h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-black px-[20px] text-[#FFFFFF]"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        name="inputValue"
                        value={inputValue}
                        onChange={handleInputChange}
                      ></input>
                      <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
                        <div className="h-[24px] w-[24px] rounded-full">
                          <Image
                            src="/icons/SeiLogo.svg"
                            alt=""
                            height={24}
                            width={24}
                          />
                        </div>

                        <h1 className="mt-1 text-[15px] font-bold text-white">
                          {RESERVE_SYMBOL}
                        </h1>
                      </div>
                    </div>
                    <h1 className="text-[#B8B8B8]">
                      {/*RESERVE_SYMBOL value to memetoken*/}~
                      {inputValue &&
                        Number(
                          String(
                            Math.floor(
                              Number(
                                ethers.parseEther(inputValue) /
                                  BigInt(priceForNextMint),
                              ),
                            ),
                          ),
                        )}
                      &nbsp;{memeTokenSymbol}
                    </h1>
                  </>
                )}

                {/*true == toggle module, false == percent for sell*/}
                {isBuy ? (
                  <div className="my-[15px] flex h-[20px] items-center justify-between">
                    <h1 className="text-sm text-white">
                      {tradeModuleErrorMsg}
                    </h1>
                    <div
                      onClick={() =>
                        setIsInputInTokenAmount(!isInputInTokenAmount)
                      }
                      className={`flex h-[12px] w-[46px] cursor-pointer ${isInputInTokenAmount && "flex-row-reverse"} items-center justify-between rounded-full bg-[#4E4B4B]`}
                    >
                      <div className="h-full w-[12px] rounded-full bg-[#161616]"></div>
                      <div
                        className={`h-[24px] w-[24px] rounded-full ${isInputInTokenAmount ? "bg-[#00FFF0]" : "bg-[#43FF4B]"}`}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <SellPercentageButton />
                )}

                <button
                  type="submit"
                  className={`h-[51px] w-full rounded-[8px] border-2 border-[#880400] bg-white ${impact.variable} font-impact`}
                >
                  place trade
                </button>
              </form>
            </div>
            <HolderDistributionSection />
          </div>
        </div>
      </main>
    </>
  );
}
