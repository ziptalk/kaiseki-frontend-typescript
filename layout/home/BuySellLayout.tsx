import React from "react";

import { useEffect, useState } from "react";
import { ErrorDecoder } from "ethers-decode-error";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import MCV2_ZapArtifact from "@/abis/MCV2_ZapV1.sol/MCV2_ZapV1.json";

import { ether, wei } from "@/utils/weiAndEther";
import { useEthersSigner } from "@/utils/ethersSigner";
import { BILLION } from "@/global/constants";
import contracts from "@/global/contracts";
import XButton from "@/public/icons/XButton.svg";

import TradingViewChart from "@/components/common/TradingViewWidget";
import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";
import axios from "axios";
import { TokenDesc } from "@/components/common/TokenDesc";
import { ModuleInfo } from "@/components/common/ModuleInfo";
import Slider from "@/components/common/Slider";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { Tradesection } from "@/components/detail/Tradesection";
import HomeBondingCurveCard from "@/components/home/HomeBondingCurveCard";
import { setCurStepsIntoState } from "@/utils/getCurve";

export const BuySellLayout = ({
  cid,
  createdBy,
  description,
  marketCap,
  name,
  ticker,
  tokenAddress,
  setInfo,
}: TokenInfo) => {
  // const account = useAccount();
  const isMobile = typeof window !== undefined && window.innerWidth < 768;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error);
    }
  };
  // MARK: - init ethers.js
  // const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  // const provider = new ethers.JsonRpcProvider(
  //   process.env.NEXT_PUBLIC_RPC_SEPOLIA,
  // );

  // const bondContract = new ethers.Contract(
  //   contracts.MCV2_Bond,
  //   MCV2_BondABI,
  //   provider,
  // );

  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);

  const fetchBondingCurveProgress = async () => {
    setBondingCurveProgress(
      (await setCurStepsIntoState({ tokenAddress })) || 0,
    );
  };

  useEffect(() => {
    fetchBondingCurveProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAddress]);
  // const [TXLogsFromServer, setTXLogsFromServer] = useState<any[] | null>(null);

  // const [marketCap, setMarketCap] = useState("");

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchTXLogsFromServer(
  //       tokenAddress,
  //       setTXLogsFromServer,
  //       TXLogsFromServer,
  //     );
  //   }, 5000); // Fetch every 5 seconds (adjust as needed)

  //   return () => clearInterval(interval);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   fetchTokenDetailFromContract();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tokenAddress]);

  // listen event later
  // useEffect(() => {
  //   try {
  //     if (
  //       checkMetaMaskInstalled() &&
  //       checkAccountAddressInitialized(account.address)
  //     ) {
  //       // setUserMemeTokenBalanceIntoState();
  //       // setCurStepsIntoState();
  //       // setUserReserveBalanceIntoState();
  //     }
  //   } catch {}
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account?.address, tokenAddress]);

  // const updateMarketCapToServer = async (tokenAddress: any, marketCap: any) => {
  //   try {
  //     const response = await fetch(`${SERVER_ENDPOINT}/changeMcap`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         tokenAddress: tokenAddress,
  //         marketCap: marketCap,
  //       }),
  //     });
  //     const data = await response.json();
  //     // console.log(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const fetchTokenDetailFromContract = async () => {
  //   try {
  //     const detail = await bondContract.getDetail(tokenAddress);
  //     const price = detail.info.priceForNextMint;
  //     // console.log({ detail: detail.info });
  //     setMemeTokenName(detail.info.name);
  //     setMemeTokenSymbol(detail.info.symbol);
  //     setCreator(detail.info.creator);
  //     const mcap = (
  //       Number(ethers.formatEther(price.toString())) * BILLION
  //     ).toFixed(2);
  //     // console.log("this is mcap" + mcap);
  //     const response = await axios.get(
  //       `https://api.binance.com/api/v3/ticker/price?symbol=${RESERVE_SYMBOL}USDT`,
  //     );
  //     const marketCapInUSD = (response.data.price * Number(mcap)).toFixed(0);

  //     await updateMarketCapToServer(tokenAddress, marketCapInUSD);
  //     // setMarketCap(marketCapInUSD);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const fetchTXLogsFromServer = async (
  //   tokenAddress: any,
  //   setEventsFromDB: any,
  //   eventsFromDB: any,
  // ) => {
  //   try {
  //     const response = await fetch(
  //       `${SERVER_ENDPOINT}/TxlogsMintBurn/${tokenAddress}`,
  //     );
  //     const data = await response.json();
  //     const filteredData = filterEventsByToken(data);
  //     if (filteredData.length !== eventsFromDB?.length) {
  //       setEventsFromDB(filteredData);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const checkMetaMaskInstalled = () => {
  //   if (!window.ethereum) {
  //     return false;
  //   }
  //   return true;
  // };

  // const checkAccountAddressInitialized = (address: any) => {
  //   if (!address) {
  //     return false;
  //   }
  //   return true;
  // };
  // MARK: - Get values
  // const setUserReserveBalanceIntoState = async () => {
  //   try {
  //     if (account.address) {
  //       const balanceWei = await provider.getBalance(account.address);
  //       // console.log(balanceWei);
  //       const balanceEther = ethers.formatEther(balanceWei);
  //       // console.log(balanceEther);
  //       setCurUserReserveBalance(balanceEther);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const setUserMemeTokenBalanceIntoState = async () => {
  //   try {
  //     if (account.address == null) {
  //       setCurMemeTokenValue("0");
  //       return;
  //     }
  //     const detail = await memeTokenContract.balanceOf(account.address);

  //     setCurMemeTokenValue(String(ether(detail)));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const setCurStepsIntoState = async () => {
  //   try {
  //     // Fetch the steps using the getSteps function from the contract
  //     const steps: BondStep[] = await bondContract.getSteps(tokenAddress);
  //     // console.log("Fetched steps:", steps);
  //     const targetPrice = await bondContract.priceForNextMint(tokenAddress);

  //     // Extract the step prices into a new array
  //     const stepPrices: bigint[] = steps.map((step) => step.price);

  //     for (let i = 0; i < stepPrices.length; i++) {
  //       // console.log("stepPrices[i]:" + stepPrices[i]);
  //       // console.log("stepPrices.length:" + stepPrices.length);

  //       if (Number(stepPrices[i]) == Number(targetPrice)) {
  //         setBondingCurveProgress(((i + 1) / stepPrices.length) * 100);
  //       }
  //     }

  //     // console.log("Extracted step prices:", stepPrices);
  //   } catch (error: any) {
  //     console.error("Error:", error);
  //   }
  // };

  // const handleBuyMaxInReserve = () => {
  //   setInputValue(curUserReserveBalance.substring(0, 5));
  // };

  // const handleBuyMaxinMeme = async () => {
  //   await setPriceForNextMintIntoState();
  //   await setUserMemeTokenBalanceIntoState();
  //   const userMaxAmountInMeme = String(
  //     Math.floor(
  //       Number(
  //         ethers.parseEther(curUserReserveBalance) / BigInt(priceForNextMint),
  //       ),
  //     ),
  //   );

  //   setInputValue(userMaxAmountInMeme);
  // };

  // const filterEventsByToken = (data: any): Event[] => {
  //   try {
  //     const filteredMintEvents = data.mintEvents.map((event: any) => ({
  //       ...event,
  //       isMint: true,
  //     }));

  //     const filteredBurnEvents = data.burnEvents.map((event: any) => ({
  //       ...event,
  //       isMint: false,
  //     }));

  //     const combinedEvents = [...filteredMintEvents, ...filteredBurnEvents];
  //     combinedEvents.sort(
  //       (a, b) =>
  //         new Date(b.blockTimestamp).getTime() -
  //         new Date(a.blockTimestamp).getTime(),
  //     );

  //     return combinedEvents;
  //   } catch (error) {
  //     console.log(error);
  //     return [];
  //   }
  // };

  // const transformToTradesCardType = (event: any): TradesCardType => {
  //   return {
  //     user: event.user.substring(0, 6),
  //     isBuy: event.isMint,
  //     reserveAmount: event.reserveAmount
  //       ? (
  //           Math.ceil(Number(ethers.formatEther(event.reserveAmount)) * 10000) /
  //           10000
  //         )
  //           .toFixed(4)
  //           .toString()
  //       : (
  //           Math.ceil(Number(ethers.formatEther(event.refundAmount)) * 10000) /
  //           10000
  //         )
  //           .toFixed(4)
  //           .toString(),

  //     memeTokenAmount: event.amountMinted
  //       ? Number(ethers.formatEther(event.amountMinted)).toFixed(0).toString()
  //       : ethers.formatEther(event.amountBurned),
  //     date: event.blockTimestamp.toString(),
  //     tx: event.transactionHash,
  //   };
  // };

  //MARK: - Set Distribution
  // const filterDataByOuterKey = (data: any, targetOuterKey: string) => {
  //   if (targetOuterKey in data) {
  //     return { [targetOuterKey]: data[targetOuterKey] };
  //   }
  //   return {};
  // };

  // const HolderDistributionSection: FC = () => {
  //   return (
  //     <>
  //       <div className="mt-[70px] h-[560px] w-[420px] rounded-[10px] bg-[#1A1A1A] p-[30px]">
  //         <h1 className="font-bold text-[#ADADAD]">Holder distribution</h1>
  //         <div className="mt-[20px] gap-[8px] text-[#6A6A6A]">
  //           {distribution ? (
  //             Object.entries(distribution).map(
  //               ([outerKey, innerObj], index) => (
  //                 <div key={outerKey}>
  //                   {Object.entries(innerObj).map(
  //                     ([innerKey, value], innerIndex) => (
  //                       <div key={innerKey} className="flex justify-between">
  //                         <div className="flex">
  //                           <h1>{`${innerIndex + 1}. ${innerKey.substring(0, 6)}`}</h1>
  //                           {innerKey === contracts.MCV2_Bond && (
  //                             <h1>&nbsp;💳 (bonding curve)</h1>
  //                           )}
  //                           {innerKey == creator && <h1>&nbsp;🛠️ (dev)</h1>}
  //                         </div>

  //                         <h1>{`${parseFloat(value)}%`}</h1>
  //                       </div>
  //                     ),
  //                   )}
  //                 </div>
  //               ),
  //             )
  //           ) : (
  //             <p>Loading...</p>
  //           )}
  //         </div>
  //       </div>
  //     </>
  //   );
  // };

  return (
    <div className="md:ml-[20px]">
      <div className="top-[80px] p-5 md:sticky md:p-0 md:pb-[60px]">
        <PageLinkButton
          href={tokenAddress}
          className="mt-[112px] hidden md:flex"
        >
          View details
        </PageLinkButton>
        <XButton className="ml-auto md:hidden" onClick={setInfo} />
        <div className="relative flex flex-col gap-3 bg-[#252525] pt-[10px] md:mt-[13px] md:h-[950px] md:w-[420px] md:gap-[20px] md:p-[20px]">
          <div className="flex gap-3 md:gap-[20px]">
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
              alt="Image from IPFS"
              className="h-[120px] w-[120px] border-black"
            />
            <TokenDesc
              {...{
                cid,
                createdBy,
                description,
                marketCap,
                name,
                ticker,
                tokenAddress,
              }}
            />
          </div>
          <div className="flex h-[50px] w-full bg-card">
            <Slider
              elements={[
                <ModuleInfo
                  title="Price"
                  className="mr-10 bg-transparent"
                  desc={12345.12 + " ETH"}
                  percentage="+7.31%"
                  key={"price"}
                />,
                <ModuleInfo
                  title="Marketcap"
                  className="mr-10 bg-transparent"
                  desc={marketCap + " ETH"}
                  key={"Marketcap"}
                />,
                <ModuleInfo
                  title="Virtual Liquidity"
                  className="mr-10 bg-transparent"
                  desc={"$112.77k"}
                  key={"Virtual Liquidity"}
                />,
                <ModuleInfo
                  title="24H Volume"
                  className="mr-10 bg-transparent"
                  desc={12345.12 + " ETH"}
                  key={"24H Volume"}
                />,
                <ModuleInfo
                  className="mr-10 bg-transparent"
                  title="Token Created"
                  desc={"47M"}
                  key={"Token Created"}
                />,
              ]}
            />
          </div>
          <div className="hidden h-[250px] w-full bg-[#151527] p-[13px] md:block">
            <div className="flex items-center gap-[7.15px]">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                alt="Image from IPFS"
                className="h-[20.5px] w-[28.5px] border-black "
              />
              <p className="inline-block text-[14.3px] text-white">
                {name.length > 20 ? name.slice(0, 17) + "..." : name} (${" "}
                {ticker}) / ETH
              </p>
            </div>
            <div className="h-[210px] border-black ">
              <TradingViewChart tokenAddress={tokenAddress} />
            </div>
          </div>
          {isMobile && (
            <div className="flex items-center justify-between gap-2 bg-[#1c1c1c] p-1">
              <div className=" overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-[#aeaeae]">
                Contract Address: {tokenAddress}
              </div>
              <button
                onClick={() => copyToClipboard(tokenAddress)}
                className="rounded-md border border-[#8f8f8f] bg-[#0e0e0e] px-2 py-1 text-xs font-bold text-white"
              >
                Copy
              </button>
            </div>
          )}
          <Tradesection
            {...{
              memeTokenSymbol: ticker,
              RESERVE_SYMBOL,
              tokenAddress,
            }}
          />
          {/* <SellPercentageButton /> */}
          {isMobile || (
            <HomeBondingCurveCard prog={Math.floor(bondingCurveProgress)} />
          )}
          <div className="absolute bottom-3 right-5 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#AEAEAE] text-black md:flex">
            ?
          </div>
        </div>
      </div>
    </div>
  );
};
