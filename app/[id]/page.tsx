"use client";

import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import reserveTokenABI from "@/abis/ReserveToken/ReserveToken.json";
import TokenCard from "@/components/TokenCard";
import BondingCurveCard from "@/components/TokenDetail/BondingCurveCard";
import SocialLinkCard from "@/components/TokenDetail/SocialLinkCard";
import TradesCard from "@/components/TokenDetail/TradesCard";
import TradingViewWidget from "@/components/TradingViewWidget";
import contracts from "@/contracts/contracts";
import { impact } from "@/fonts/font";
import { useEthersSigner } from "@/hooks/ethersSigner";
import axios from "axios";
import { formatEther } from "ethers";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
const util = require("util");

export default function Detail() {
  const signer = useEthersSigner();
  const { abi: MCV2_TokenABI } = MCV2_TokenArtifact;
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
  };

  const ether = (weiValue: bigint, decimals = 18): number => {
    const factor = BigInt(10) ** BigInt(decimals);
    const etherValue = Number(weiValue) / Number(factor);
    return etherValue;
  };
  const cleanPathname = (path: string) => {
    return path.startsWith("/") ? path.slice(1) : path;
  };

  const pathname = usePathname();

  const account = useAccount();
  const cleanedPathname = cleanPathname(pathname);
  const tokenAddress: any = cleanedPathname;
  const MAX_INT_256: BigInt = BigInt(2) ** BigInt(256) - BigInt(2);

  // MARK: - init ethers.js
  const { ethers } = require("ethers");
  const provider = new ethers.JsonRpcProvider(
    "https://evm-rpc-arctic-1.sei-apis.com",
  );
  const reserveTokenContract = new ethers.Contract(
    contracts.ReserveToken,
    reserveTokenABI,
    provider,
  );

  const reserveTokenWriteContract = new ethers.Contract(
    contracts.ReserveToken,
    reserveTokenABI,
    signer,
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

  // Call the getSteps function
  // MARK: - useState
  const [name, setName] = useState("Name");
  const [symbol, setSymbol] = useState("ticker");
  const [creator, setCreator] = useState("Me");
  const [isBuy, setIsBuy] = useState(true);
  const [curMemeTokenValue, setCurMemeTokenValue] = useState("0");
  const [curSEIValue, setCurSEIValue] = useState("0");
  const [curWSEIValue, setCurWSEIValue] = useState("0");
  const [inputValue, setInputValue] = useState("");
  const [marketCap, setMarketCap] = useState("");
  const [txState, setTxState] = useState("idle");
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  const [SEIPrice, setSEIPrice] = useState(0);
  const [InputState, setInputState] = useState(true);

  useEffect(() => {
    const fetchTokenDetail = async () => {
      try {
        const detail = await bondContract.getDetail(tokenAddress);
        // TODO - Make this Value more easy to read
        // setLoading(true);
        const response = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=SEIUSDT`,
        );
        console.log("SEI PRICE" + response.data.price);
        setSEIPrice(response.data.price);
        // setLoading(false);

        // Log and set the state with the returned details
        const currentSupply = detail.info.currentSupply;
        const price = detail.info.priceForNextMint;
        // console.log("currentSupply :" + detail.info.currentSupply);
        setName(detail.info.name);
        setSymbol(detail.info.symbol);
        setCreator(detail.info.creator);
        setMarketCap(
          String(ether(currentSupply) * (ether(price) * response.data.price)),
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchTokenDetail();
    getMemeTokenValue();
  }, []);

  useEffect(() => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }
      getMemeTokenValue();
      getCurSteps();
      getNextMintPrice();
      getWSEIValue();
    } catch {}
  }, [account.address]);

  const getSEIValue = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }
      const Eprovider = new ethers.BrowserProvider(window.ethereum);
      // setMarketCap(detail.info.marketCap);
      const balanceWei = await Eprovider.getBalance(account.address);
      // Convert the balance to Ether
      const balanceEther = ether(balanceWei);
      console.log(balanceEther);
      setCurSEIValue(String(balanceEther));
    } catch (error) {
      console.log(error);
    }
  };

  const getWSEIValue = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }

      const balanceWei = await reserveTokenContract.balanceOf(account.address);
      // Convert the balance to Ether
      const balanceEther = ether(balanceWei);
      console.log(balanceEther);
      setCurWSEIValue(String(balanceEther));
    } catch (error) {
      console.log(error);
    }
  };

  const getMemeTokenValue = async () => {
    try {
      if (!account.address) {
        setCurMemeTokenValue("0");
        throw new Error("Account is not defined");
      }
      const detail = await memeTokenContract.balanceOf(account.address);
      console.log(detail);

      setCurMemeTokenValue(String(ether(detail)));
    } catch (error) {
      console.log(error);
    }
  };
  interface BondStep {
    price: bigint;
    step: bigint;
  }

  const getCurSteps = async () => {
    try {
      if (!account.address) {
        throw new Error("Account is not defined");
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
      if (!account.address) {
        throw new Error("Account is not defined");
      }
      const detail = await bondContract.priceForNextMint(tokenAddress);
      console.log("NextMintPrice :" + detail);
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

  // MARK: - Buy

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;

    console.log("start-app");
    try {
      if (!account.address) {
        alert("Connect your wallet first!");
        throw new Error("Account is not defined");
      }
      const allowance = await reserveTokenWriteContract.allowance(
        account.address,
        contracts.MCV2_Bond,
      );
      if (BigInt(allowance) < BigInt(wei(Number(inputValue)))) {
        console.log("Approving token...");
        setTxState("Approving token...");
        const detail = await reserveTokenWriteContract.approve(
          contracts.MCV2_Bond,
          BigInt(wei(Number(inputValue))),
        );
        console.log("Approval detail:", detail);
      }

      console.log("Minting token...");
      setTxState("Minting token...");
      const mintDetail = await bondWriteContract.mint(
        tokenAddress,
        BigInt(wei(Number(inputValue))),
        MAX_INT_256,
        account.address,
      );
      console.log("Mint detail:", mintDetail);
      setTxState("Success");
    } catch (error: any) {
      console.error("Error:", error);
      setTxState("ERR");
    }
    await getMemeTokenValue();
  }

  // MARK: - Sell

  async function submitSell(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const inputValue = formData.get("inputValue") as string;

    console.log("start-app");

    try {
      if (!account.address) {
        alert("Connect your wallet first!");
        throw new Error("Account is not defined");
      }
      console.log("Approving token...");
      setTxState("Approving token...");
      const detail = await memeTokenWriteContract.approve(
        contracts.MCV2_Bond,
        BigInt(wei(Number(inputValue))),
      );
      console.log("Approval detail:", detail);

      console.log("Burning token...");
      setTxState("Burning token...");
      const burnDetail = await bondWriteContract.burn(
        tokenAddress,
        BigInt(wei(Number(inputValue))),
        0,
        account.address,
      );
      console.log("Burn detail:", burnDetail);
      setTxState("Success");
    } catch (error) {
      console.error("Error:", error);
      setTxState("ERR");
    }
    await getMemeTokenValue();
  }

  // MARK: - TradesDB

  const [mintEventsFromDB, setMintEventsFromDB] = useState<any[]>([]);
  const [burnEventsFromDB, setBurnEventsFromDB] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/TxlogsMintBurn")
      .then((response) => response.json())
      .then((data) => {
        setMintEventsFromDB(data.mintEvents);
        setBurnEventsFromDB(data.burnEvents);
      });
  }, []);

  useEffect(() => {
    const filterAndCombineEvents = () => {
      let filteredMintEvents = mintEventsFromDB;
      let filteredBurnEvents = burnEventsFromDB;

      if (tokenAddress) {
        filteredMintEvents =
          mintEventsFromDB?.filter((event) => event.token === tokenAddress) ||
          [];
        filteredBurnEvents =
          burnEventsFromDB?.filter((event) => event.token === tokenAddress) ||
          [];
      }

      const combinedEvents = [...filteredMintEvents, ...filteredBurnEvents];
      combinedEvents.sort(
        (a, b) =>
          new Date(b.blockTimestamp).getTime() -
          new Date(a.blockTimestamp).getTime(),
      );

      setFilteredEvents(combinedEvents);
    };

    filterAndCombineEvents();
  }, [tokenAddress, mintEventsFromDB, burnEventsFromDB]);

  const formatSeiAmount = (amount: string) => {
    const etherValue = parseFloat(formatEther(amount));
    const roundedValue = Math.ceil(etherValue * 1000) / 1000;
    return roundedValue.toFixed(3);
  };

  const formatMemeTokenAmount = (amount: string) => {
    const etherValue = parseFloat(formatEther(amount));
    const kValue = etherValue / 1000;
    const roundedValue = Math.ceil(kValue * 10) / 10;
    return `${roundedValue.toFixed(2)}k`;
  };

  return (
    <>
      <main className="flex w-screen bg-[#0E0E0E]">
        <div className="mx-auto flex h-full w-full justify-between px-[5vw] pt-[60px]">
          <div className="w-[60vw]">
            <div className="flex h-[245px] items-center justify-between bg-[#1A1A1A] px-[20px] py-[30px]">
              <div className="h-full w-[40%]">
                <TokenCard
                  name={name}
                  ticker={symbol}
                  cap={marketCap}
                  createdBy={creator.substring(0, 5)}
                  desc="desc"
                  tokenAddress=""
                  border={true}
                />
              </div>

              <SocialLinkCard
                tw="https://chatgpt.com/"
                tg="https://chatgpt.com/"
              />

              <BondingCurveCard
                prog={Math.floor(bondingCurveProgress)}
                desc="desc"
              />
            </div>
            <div className="mt-[20px] flex h-[420px] gap-[20px]">
              <TradingViewWidget />
            </div>
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
              {filteredEvents?.length > 0 ? (
                <ul>
                  {filteredEvents.map((event) => (
                    <li key={event.eventId}>
                      <TradesCard
                        isBuy={event.amountMinted ? true : false}
                        seiAmount={
                          event.amountMinted
                            ? formatSeiAmount(event.amountMinted._hex)
                            : formatSeiAmount(event.amountBurned._hex)
                        }
                        memeTokenAmount={
                          event.reserveAmount
                            ? formatMemeTokenAmount(event.reserveAmount._hex)
                            : formatMemeTokenAmount(event.refundAmount._hex)
                        }
                        date={new Date(event.blockTimestamp).toLocaleString()}
                        tx={event.transactionHash.slice(-6)}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div>
            <div className=" w-[420px] rounded-[15px] border border-yellow-400 bg-gradient-to-b from-[#A60600] to-[#880400] p-[30px]">
              <div className="flex gap-[10px] rounded-[15px] border-2 border-[#880400] bg-black p-[10px]">
                <button
                  className={`h-[44px] w-full rounded-2xl ${impact.variable} font-impact ${isBuy ? " border-[#43FF4B] bg-white" : " border-[#4E4B4B] bg-[#4E4B4B]"} border-2 `}
                  onClick={() => setIsBuy(true)}
                >
                  Buy
                </button>
                <button
                  className={`h-[44px] w-full rounded-2xl border-2 ${impact.variable} font-impact ${isBuy ? " border-[#4E4B4B] bg-[#4E4B4B]" : "border-[#FB30FF] bg-white"}`}
                  onClick={() => {
                    setIsBuy(false);
                    setInputState(true);
                  }}
                >
                  Sell
                </button>
              </div>
              <form
                onSubmit={isBuy ? submit : submitSell}
                className="flex flex-col"
              >
                <div className="flex justify-between">
                  <div />
                  <div
                    className="mt-[15px]
                   flex h-[30px] w-[128px] cursor-pointer items-center justify-center rounded-lg bg-black text-sm text-[#A7A7A7]"
                  >
                    Set max slippage
                  </div>
                </div>
                {InputState ? (
                  <>
                    <div className="relative flex w-full items-center">
                      <input
                        className="my-[8px] h-[55px] w-full rounded-[5px] border border-[#5C5C5C] bg-black px-[20px] text-[#5C5C5C]"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        name="inputValue"
                        value={inputValue}
                        onChange={handleInputChange}
                      ></input>
                      <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
                        <div className="h-[24px] w-[24px] rounded-full bg-gray-100"></div>
                        <h1 className="mt-1 text-[15px] font-bold text-white">
                          {name}
                        </h1>
                      </div>
                    </div>
                    <h1 className="text-[#B8B8B8]">
                      {curMemeTokenValue}&nbsp;
                      {name}
                    </h1>
                  </>
                ) : (
                  <>
                    <>
                      <div className="relative flex w-full items-center">
                        <input
                          className="my-[8px] h-[55px] w-full rounded-[5px] border border-[#5C5C5C] bg-black px-[20px] text-[#5C5C5C]"
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          name="inputValue"
                          value={inputValue}
                          onChange={handleInputChange}
                        ></input>
                        <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
                          <div className="h-[24px] w-[24px] rounded-full bg-gray-100"></div>
                          <h1 className="mt-1 text-[15px] font-bold text-white">
                            WSEI
                          </h1>
                        </div>
                      </div>
                      <h1 className="text-[#B8B8B8]">
                        {curWSEIValue}&nbsp;WSEI
                      </h1>
                    </>
                  </>
                )}

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
                  <>
                    <h1 className="mt-[15px] text-sm text-white">{txState}</h1>
                    <div className="my-[15px] flex h-[20px] gap-[7px] text-[13px] ">
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
                )}

                <button
                  type="submit"
                  className={`h-[50px] w-full rounded-2xl border-2 border-[#880400] bg-white ${impact.variable} font-impact`}
                >
                  place trade
                </button>
              </form>
            </div>
            <div className="mt-[70px] h-[560px] w-[420px] rounded-[10px] bg-[#1A1A1A] p-[30px]">
              <h1 className="font-bold text-[#ADADAD]">Holder distribution</h1>
              <div className="mt-[20px] gap-[8px] text-[#6A6A6A]">
                <div className=" flex justify-between font-bold">
                  <h1>1. C87gCy 💳 (bonding curve)</h1>
                  <h1>98.48%</h1>
                </div>
                <div className=" flex justify-between">
                  <h1>2. H41bQv 🛠️ (dev)</h1>
                  <h1>01.52%</h1>
                </div>
                <div className=" flex justify-between">
                  <h1>3. H41bQv</h1>
                  <h1>01.52%</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
