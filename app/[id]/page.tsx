"use client";

import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import reserveTokenABI from "@/abis/ReserveToken/ReserveToken.json";
import BondingCurveCard from "@/components/detail/BondingCurveCard";
import SocialLinkCard from "@/components/detail/SocialLinkCard";
import TradesCard from "@/components/detail/TradesCard";
import TokenCard from "@/components/shared/TokenCard";

import { impact } from "@/fonts/font";
import contracts from "@/global/contracts";
import { useEthersSigner } from "@/global/ethersSigner";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import { wagmiSeiDevConfig } from "@/config";
import endpoint from "@/global/endpoint";
import { getBalance } from "wagmi/actions";
import rpcProvider from "@/global/rpcProvider";
import { ether, wei } from "@/global/weiAndEther";

import { ErrorDecoder } from "ethers-decode-error";
import { stepPrices800 } from "../create/createValue";
import TradingViewChart from "../test/shared/TradingTest";

export default function Detail() {
  const signer = useEthersSigner();
  const pathname = usePathname();
  const account = useAccount();

  const { abi: MCV2_TokenABI } = MCV2_TokenArtifact;
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;

  const cleanPathname = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
  };

  const cleanedPathname = cleanPathname(pathname);
  const tokenAddress: any = cleanedPathname;
  const MAX_INT_256: BigInt = BigInt(2) ** BigInt(256) - BigInt(2);
  const errorDecoder = ErrorDecoder.create([MCV2_BondABI]);
  // MARK: - init ethers.js
  const { ethers } = require("ethers");
  const provider = new ethers.JsonRpcProvider(rpcProvider);
  // const reserveTokenContract = new ethers.Contract(
  //   contracts.ReserveToken,
  //   reserveTokenABI,
  //   provider,
  // );

  // const reserveTokenWriteContract = new ethers.Contract(
  //   contracts.ReserveToken,
  //   reserveTokenABI,
  //   signer,
  // );

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

  const memeTokenContract = new ethers.Contract(
    tokenAddress,
    MCV2_TokenABI,
    provider,
  );

  // const memeTokenWriteContract = new ethers.Contract(
  //   tokenAddress,
  //   MCV2_TokenABI,
  //   signer,
  // );

  // Call the getSteps function
  // MARK: - useState
  const [name, setName] = useState("Name");
  const [symbol, setSymbol] = useState("ticker");
  const [creator, setCreator] = useState("Me");
  const [totalMintAmount, setTotalMintAmount] = useState(BigInt(0));
  const [isBuy, setIsBuy] = useState(true);
  const [curMemeTokenValue, setCurMemeTokenValue] = useState("0");
  const [curSEIValue, setCurSEIValue] = useState("0");
  // const [curWSEIValue, setCurWSEIValue] = useState("0");
  const [inputValue, setInputValue] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const [txState, setTxState] = useState("");
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [SEIPrice, setSEIPrice] = useState(5);
  const [InputState, setInputState] = useState(true);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const billion: number = 1_000_000_000;
  const [priceForNextMint, setPriceForNextMint] = useState(0);

  // MARK: - UploadMCap

  const updateMarketCapToServer = async (tokenAddress: any, marketCap: any) => {
    try {
      const response = await fetch(`${endpoint}/changeMcap`, {
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

  useEffect(() => {
    const fetchTokenDetail = async () => {
      try {
        const detail = await bondContract.getDetail(tokenAddress);
        const price = detail.info.priceForNextMint;
        // console.log("currentSupply :" + detail.info.currentSupply);
        setName(detail.info.name);
        setSymbol(detail.info.symbol);
        setCreator(detail.info.creator);
        setTotalMintAmount(detail.info.currentSupply);
        const mcap = String(ether(BigInt(Number(price) * billion)) / 1000);
        // console.log("this is mcap" + mcap);
        await updateMarketCapToServer(tokenAddress, mcap);
        setMarketCap(mcap);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTokenDetail();
    getMemeTokenValue();
  }, []);

  // listen event later
  useEffect(() => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      } else if (account.address == null) {
        return;
      }
      getMemeTokenValue();
      getCurSteps();
      getNextMintPrice();
      getSEIValue();
    } catch {}
  }, [account.address]);

  // MARK: - Get values

  const getSEIValue = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      } else if (account.address == null) {
        return;
      }
      if (account.address) {
        const balanceWei = await getBalance(wagmiSeiDevConfig, {
          address: account.address,
        });
        const balanceEther = String(balanceWei.value);
        console.log(balanceEther);
        setCurSEIValue(balanceEther);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMemeTokenValue = async () => {
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

  const getCurSteps = async () => {
    try {
      if (account.address == null) {
        return;
      }

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
      return stepPrices;
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  const getNextMintPrice = async () => {
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

  function subtractTenPercent(value: any) {
    const tenPercent = BigInt(value) / BigInt(10); // 10% 계산
    const result = BigInt(value) - tenPercent; // 10% 뺀 값 계산
    return result;
  }

  // MARK: - Buy

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;
    if (account.address == null) {
      alert("Connect your wallet first!");
      setTxState("Connect your wallet first!");
      return;
    }
    if (chainId != 713715) {
      switchChain({ chainId: 713715 });
      setTxState("Change your network first!");
      return;
    }

    if (
      BigInt(Math.floor(Number(inputValue))) * BigInt(priceForNextMint) >
      Number(curSEIValue)
    ) {
      setTxState(`Insufficient balance : You have ${curSEIValue} SEI`);
      return;
    }
    console.log("start-app");
    try {
      const inputInToken = BigInt(ethers.parseUnits(inputValue, "ether"));
      const inputInSEI = subtractTenPercent(
        ethers.parseUnits(
          String(
            Math.floor(
              Number(
                ethers.parseUnits(inputValue, "ether") /
                  BigInt(priceForNextMint),
              ),
            ),
          ),
          "ether",
        ),
      );

      console.log("inputInToken :" + inputInToken);
      console.log("inputInSEI :" + inputInSEI);

      console.log("Minting token...");
      setTxState("Minting token...");

      // const sp = stepPrices800();
      // const divValue = Math.floor(
      //   Number(totalMintAmount / BigInt(1000000000000000000000000)),
      // );
      // console.log("TMA" + totalMintAmount);
      // const additionalStep = InputState
      //   ? (BigInt(sp[divValue]) - BigInt(priceForNextMint)) * inputInToken
      //   : (BigInt(sp[divValue]) - BigInt(priceForNextMint)) * inputInSEI;

      // console.log("ADS" + additionalStep);

      const amountETH = await bondWriteContract.getReserveForToken(
        tokenAddress,
        InputState ? inputInToken : inputInSEI,
      );

      const valueInEth = ethers.formatEther(amountETH[0].toString());
      const valueInWei = ethers.parseUnits(valueInEth);
      // const valueInWei = ethers.parseUnits(valueInEth) + additionalStep;
      // console.log("VIW BF" + ethers.parseUnits(valueInEth));
      // console.log("VIW AF" + valueInWei);

      const mintDetail = await bondWriteContract.mint(
        tokenAddress,
        InputState ? inputInToken : inputInSEI,
        MAX_INT_256,
        account.address,
        {
          value: valueInWei.toString(),
        },
      );

      console.log("Mint detail:", mintDetail);
      await getCurSteps();
      setTxState("Success");
    } catch (error: any) {
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      console.error("Error while minting:", error);
      console.error(error);
      setTxState(error.code);
    }
    await getMemeTokenValue();
  }

  // MARK: - Sell

  async function submitSell(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;
    if (account.address == null) {
      alert("Connect your wallet first!");
      return;
    }
    if (chainId != 713715) {
      switchChain({ chainId: 713715 });
    }

    if (
      ether(BigInt(Math.floor(Number(inputValue)))) > Number(curMemeTokenValue)
    ) {
      setTxState(
        `Insufficient balance : You have ${curMemeTokenValue} ${name}`,
      );
      return;
    }

    console.log("start-app");

    try {
      console.log("Burning token...");
      setTxState("Burning token...");
      const amountETH = await bondWriteContract.getRefundForTokens(
        tokenAddress,
        BigInt(wei(Number(inputValue))),
      );
      const valueInEth = ethers.formatEther(amountETH[0].toString());
      const valueInWei = ethers.parseEther(valueInEth);

      const burnDetail = await bondWriteContract.burn(
        tokenAddress,
        BigInt(wei(Number(inputValue))),
        1000000000000,
        account.address,
      );
      console.log("Burn detail:", burnDetail);
      await getCurSteps();
      setTxState("Success");
    } catch (error) {
      const decodedError = await errorDecoder.decode(error);

      // Prints "Invalid swap with token contract address 0xabcd."
      console.log("Custom error reason:", decodedError);
      console.error("Error while burning:", error);

      setTxState("ERR");
    }
    await getMemeTokenValue();
  }

  //MARK: - Fetch Token Info
  const [cid, setCid] = useState(
    "QmT9jVuYbem8pJpMVtcEqkFRDBqjinEsaDtm6wz9R8VuKC",
  );
  const [tw, setTw] = useState("");
  const [tg, setTg] = useState("");
  const [web, setWeb] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    fetch(`${endpoint}/homeTokenInfo`) // Add this block
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (item: any) => item.tokenAddress == tokenAddress,
        );
        // console.log(filteredData);
        setCid(filteredData[0].cid);
        setTw(filteredData[0].twitterUrl);
        setTg(filteredData[0].telegramUrl);
        setWeb(filteredData[0].websiteUrl);
        setDesc(filteredData[0].description);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //MARK: - Fetch Trades
  const [eventsFromDB, setEventsFromDB] = useState<any[] | null>(null);
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${endpoint}/TxlogsMintBurn`)
        .then((response) => response.json())
        .then((data) => {
          const filteredData = filterEventsByToken(data, tokenAddress);
          if (filteredData.length != eventsFromDB?.length) {
            setEventsFromDB(filteredData);
          }
        })
        .catch((error) => console.log(error));
    }, 5000); // Fetch every 5 seconds (adjust as needed)
    return () => clearInterval(interval);
  }, []);

  function filterEventsByToken(data: any, token: any): Event[] {
    try {
      const filteredMintEvents = data.mintEvents
        .filter((event: any) => event.token.tokenAddress === token)
        .map((event: any) => ({ ...event, isMint: true }));

      const filteredBurnEvents = data.burnEvents
        .filter((event: any) => event.token === token)
        .map((event: any) => ({ ...event, isMint: false }));

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
  }

  const transformToTradesCardType = (event: Event): TradesCardType => {
    return {
      user: event.user.substring(0, 6),
      isBuy: event.isMint,
      seiAmount: event.reserveAmount
        ? ether(BigInt(parseInt(event.reserveAmount._hex, 16)))
            .toFixed(4)
            .toString()
        : ether(BigInt(parseInt(event.refundAmount!._hex, 16)))
            .toFixed(4)
            .toString(),

      memeTokenAmount: event.amountMinted
        ? ether(BigInt(parseInt(event.amountMinted._hex, 16)))
            .toFixed(0)
            .toString()
        : parseInt(event.amountBurned?._hex || "0", 16).toString(),
      date: event.blockTimestamp.toString(),
      tx: event.transactionHash.slice(-6),
    };
  };

  const TradesSection: FC = () => {
    return (
      <>
        <h1 className="mt-[30px] text-xl font-bold text-white">Trades</h1>
        <div className="mb-20 mt-[15px] gap-[20px] rounded-[10px] bg-[#1A1A1A]  p-[30px]">
          <div className="flex w-full justify-between border-b border-[#6A6A6A] px-[10px] pb-[15px] text-[#6A6A6A]">
            <h1 className="w-1/6">account</h1>
            <h1 className="w-1/6">buy / sell</h1>
            <h1 className="w-1/6">SEI</h1>
            <h1 className="w-1/6">{symbol}</h1>
            <h1 className="w-1/6">date</h1>
            <h1 className="flex w-1/6 flex-row-reverse">transaction</h1>
          </div>
          {eventsFromDB ? (
            eventsFromDB.map((event) => {
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
              setInputState(true);
            }}
          >
            Sell
          </button>
        </div>
      </>
    );
  };

  //MARK: - Set Distribution

  const [distribution, setDistribution] = useState<FilteredData | undefined>(
    undefined,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${endpoint}/HolderDistribution`)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          const filteredData = filterDataByOuterKey(data, tokenAddress);

          setDistribution(filteredData);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 5000); // Fetch every 5 seconds (adjust as needed)
    return () => clearInterval(interval);
  }, []);

  function filterDataByOuterKey(data: any, targetOuterKey: string) {
    if (targetOuterKey in data) {
      return { [targetOuterKey]: data[targetOuterKey] };
    }
    return {};
  }

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
    return (
      <>
        <h1 className="mt-[15px] text-sm text-white">{txState}</h1>
        <div className="my-[15px] flex h-[20px] gap-[7px] text-[13px]">
          <button
            type="button"
            className="rounded-[4px] bg-[#202020] px-[8px] text-[#A8A8A8]"
            onClick={handleReset}
          >
            reset
          </button>
          <button
            type="button"
            className="rounded-[4px] bg-[#202020] px-[8px] text-[#A8A8A8]"
            onClick={() => handlePercentage(25)}
          >
            25%
          </button>
          <button
            type="button"
            className="rounded-[4px] bg-[#202020] px-[8px] text-[#A8A8A8]"
            onClick={() => handlePercentage(50)}
          >
            50%
          </button>
          <button
            type="button"
            className="rounded-[4px] bg-[#202020] px-[8px] text-[#A8A8A8]"
            onClick={() => handlePercentage(75)}
          >
            75%
          </button>
          <button
            type="button"
            className="rounded-[4px] bg-[#202020] px-[8px] text-[#A8A8A8]"
            onClick={() => handlePercentage(100)}
          >
            100%
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <main className="flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto flex h-full w-full justify-between px-[5vw] pt-[60px]">
          <div className="w-[60vw]">
            <div className="flex h-[245px] items-center justify-between bg-[#1A1A1A] px-[20px] py-[30px]">
              <div className="h-full w-[40%]">
                <TokenCard
                  cid={cid}
                  name={name}
                  ticker={symbol}
                  cap={marketCap}
                  createdBy={creator.substring(0, 6)}
                  desc={desc}
                  tokenAddress=""
                  border={true}
                />
              </div>

              <SocialLinkCard tw={tw} tg={tg} web={web} />

              <BondingCurveCard
                prog={Math.floor(bondingCurveProgress)}
                desc="desc"
              />
            </div>
            <div className="mt-[20px] flex h-[420px] gap-[20px]">
              <TradingViewChart tokenAddress={tokenAddress} />
            </div>
            <TradesSection />
          </div>
          <div>
            <div className=" w-[420px] rounded-[15px] border border-[#FAFF00] bg-gradient-to-b from-[#E00900] to-[#A60D07] p-[30px] shadow-[0_0px_10px_rgba(0,0,0,0.5)] shadow-[#FFF100]">
              <BuySellButtonSection />
              <form
                onSubmit={isBuy ? submit : submitSell}
                className="flex flex-col"
              >
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
                {InputState ? (
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
                          {symbol}
                        </h1>
                      </div>
                    </div>
                    <h1 className="text-[#B8B8B8]">
                      {/* {curMemeTokenValue}&nbsp; */}
                      {/* {name} */}
                      {/*memetoken value to SEI*/}
                      {ether(
                        BigInt(Math.floor(Number(inputValue))) *
                          BigInt(priceForNextMint),
                      )}
                      &nbsp;SEI
                    </h1>
                  </>
                ) : (
                  <>
                    {/*input amount == SEI*/}
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
                          SEI
                        </h1>
                      </div>
                    </div>
                    <h1 className="text-[#B8B8B8]">
                      {/*SEI value to memetoken*/}~
                      {inputValue &&
                        Number(
                          String(
                            Math.floor(
                              Number(
                                ethers.parseUnits(inputValue, "ether") /
                                  BigInt(priceForNextMint),
                              ),
                            ),
                          ),
                        )}
                      &nbsp;{symbol}
                    </h1>
                  </>
                )}

                {/*true == toggle module, false == percent for sell*/}
                {isBuy ? (
                  <div className="my-[15px] flex h-[20px] items-center justify-between">
                    <h1 className="text-sm text-white">{txState}</h1>
                    <div
                      onClick={() => setInputState(!InputState)}
                      className={`flex h-[12px] w-[46px] cursor-pointer ${InputState && "flex-row-reverse"} items-center justify-between rounded-full bg-[#4E4B4B]`}
                    >
                      <div className="h-full w-[12px] rounded-full bg-[#161616]"></div>
                      <div
                        className={`h-[24px] w-[24px] rounded-full ${InputState ? "bg-[#00FFF0]" : "bg-[#43FF4B]"}`}
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
