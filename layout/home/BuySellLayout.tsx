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
import { MAX_INT_256, BILLION } from "@/global/constants";
import contracts from "@/global/contracts";

import TradingViewChart from "@/components/common/TradingViewWidget";
import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";
import axios from "axios";
import { TokenDesc } from "@/components/common/TokenDesc";
import { ModuleInfo } from "@/components/common/ModuleInfo";
import Slider from "@/components/common/Slider";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { Tradesection } from "@/components/detail/Tradesection";
import HomeBondingCurveCard from "@/components/home/HomeBondingCurveCard";

export const BuySellLayout = ({
  cid,
  createdBy,
  description,
  marketCap,
  name,
  ticker,
  tokenAddress,
}: TokenInfo) => {
  const signer = useEthersSigner();
  const account = useAccount();

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

  const [memeTokenName, setMemeTokenName] = useState("");
  const [memeTokenSymbol, setMemeTokenSymbol] = useState("");
  const [creator, setCreator] = useState("");
  const [TXLogsFromServer, setTXLogsFromServer] = useState<any[] | null>(null);

  const [curMemeTokenValue, setCurMemeTokenValue] = useState("0");
  const [curUserReserveBalance, setCurUserReserveBalance] = useState("0");
  const [priceForNextMint, setPriceForNextMint] = useState(0);
  const [bondingCurveProgress, setBondingCurveProgress] = useState(0);
  // const [marketCap, setMarketCap] = useState("");

  const [isBuy, setIsBuy] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [tradeModuleErrorMsg, setTradeModuleErrorMsg] = useState("");
  const [isInputInTokenAmount, setIsInputInTokenAmount] = useState(true);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTXLogsFromServer(
        tokenAddress,
        setTXLogsFromServer,
        TXLogsFromServer,
      );
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchTokenDetailFromContract();
  }, [tokenAddress]);

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
  }, [account?.address, tokenAddress]);

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

  const fetchTokenDetailFromContract = async () => {
    try {
      const detail = await bondContract.getDetail(tokenAddress);
      const price = detail.info.priceForNextMint;
      // console.log({ detail: detail.info });
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
      // setMarketCap(marketCapInUSD);
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
    <div className="ml-[20px]">
      <div className="sticky top-[80px] pb-[60px]">
        <PageLinkButton href={tokenAddress} className="mt-[112px]">
          View details
        </PageLinkButton>
        <div className="relative mt-[13px] flex h-[950px] w-[420px] flex-col gap-[20px] bg-[#252525] p-[20px] pt-[10px]">
          <div className="flex gap-[20px]">
            <img
              src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
              alt="Image from IPFS"
              className="h-[120px] w-[120px] border-black "
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
          <div className="h-[250px] w-full bg-[#151527] p-[13px]">
            <div className="h-[210px] w-full">
              <div className="flex items-center gap-[7.15px]">
                <img
                  src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                  alt="Image from IPFS"
                  className="h-[28.5px] w-[28.5px] border-black "
                />
                <p className="inline-block text-[14.3px] text-white">
                  {name} ($ {ticker}) / ETH
                </p>
              </div>
              <TradingViewChart tokenAddress={tokenAddress} />
            </div>
          </div>
          <Tradesection
            {...{
              isBuy,
              setIsBuy,
              setIsInputInTokenAmount,
              isInputInTokenAmount,
              inputValue,
              handleInputChange,
              handlePercentage,
              buy,
              sell,
              memeTokenSymbol,
              priceForNextMint,
              RESERVE_SYMBOL,
            }}
          />
          {/* <SellPercentageButton /> */}
          <HomeBondingCurveCard prog={Math.floor(bondingCurveProgress)} />
          <div className="absolute bottom-3 right-5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#AEAEAE] text-black">
            ?
          </div>
        </div>
      </div>
    </div>
  );
};
