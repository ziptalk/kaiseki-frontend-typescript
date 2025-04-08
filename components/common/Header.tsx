"use client";
import { FC, useEffect, useRef, useState } from "react";
import {
  ConnectButton,
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import styled, { keyframes } from "styled-components";
import { useAccount, useConnect } from "wagmi";
import { ethers } from "ethers";
import axios from "axios";
import Link from "next/link";

import {
  ModalContentBox,
  ModalRootWrapper,
  ModalRootWrapperWallet,
} from "./Modal";

import { PROJECT_CHAIN_ID, RESERVE_SYMBOL } from "@/global/projectConfig";
import X from "@/public/icons/X_logo.svg";
import Info from "@/public/icons/info.svg";
import DownArrow from "@/public/icons/dwnArrow.svg";
import Power from "@/public/icons/power.svg";
import Telegram from "@/public/icons/telegram_logo.svg";
import Copy from "@/public/icons/copy.svg";
import Wallet from "@/public/icons/wallet.svg";
import Bomb from "@/public/icons/bomb.svg";
import { MypageModal } from "@/layout/home/MypageModal";
import Slider from "./Slider";
import BottomSheet from "../home/BottomSheet/BottomSheet";
import BombCreate from "@/public/icons/bomb_create.svg";
import BombBuy from "@/public/icons/bomb_buy.svg";
import BombSold from "@/public/icons/bomb_sold.svg";
import { TokensLatest } from "@/utils/apis/apis";

const Header: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { connectors } = useConnect();
  const { openChainModal } = useChainModal();
  const { address, chainId, isConnected, connector } = useAccount();

  const [disconnectToggle, setDisconnectToggle] = useState(false);
  const [curMintValue, setCurMintValue] = useState("");
  const [curMintTic, setCurMintTic] = useState("");
  const [curMintUser, setCurMintUser] = useState("");
  const [curMintCid, setCurMintCid] = useState("");
  const [curMintTokenAddress, setCurMintTokenAddress] = useState("");
  const [curCreateTic, setCurCreateTic] = useState("");
  const [curCreateUser, setCurCreateUser] = useState("");
  const [curCreateTime, setCurCreateTime] = useState("");
  const [curCreateCid, setCurCreateCid] = useState("");
  const [curCreateTokenAddress, setCurCreateTokenAddress] = useState("");
  const [curBurnTic, setCurBurnTic] = useState("");
  const [curBurnUser, setCurBurnUser] = useState("");
  const [curBurnTime, setCurBurnTime] = useState("");
  const [curBurnValue, setCurBurnValue] = useState("");
  const [curBurnCid, setCurBurnCid] = useState("");
  const [curBurnTokenAddress, setCurBurnTokenAddress] = useState("");
  const [accountButtonModal, setAccountButtonModal] = useState(false);

  const [mintAnimationTrigger, setMintAnimationTrigger] = useState(false);
  const [createAnimationTrigger, setCreateAnimationTrigger] = useState(false);
  const [burnAnimationTrigger, setBurnAnimationTrigger] = useState(false);
  const [isWrongChain, setIsWrongChain] = useState(false);

  const [isInfoModalActive, setIsInfoModalActive] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(250);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    FetchLatestToken();
    localStorage.setItem("isFetching", "false");
    localStorage.setItem("isFetchingCreate", "false");
    if (localStorage.getItem("FirstVisit") === null) {
      localStorage.setItem("FirstVisit", "true");
      setIsInfoModalActive(true);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setAccountButtonModal(false);
    }
  }, [isConnected]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setDisconnectToggle(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [modalRef]);

  const ModalOff = () => {
    setAccountButtonModal(false);
  };
  // MARK: - Detect chain change
  // TODO: Make this work.....
  // useEffect(() => {
  //   window.ethereum.on("chainChanged", (chainId: any) => {
  //     console.log(chainId);
  //     if (chainId != projectChainId) {
  //       console.log("chainId from changed" + chainId);
  //       setIsWrongChain(true);
  //       console.log("changed wrong");
  //     } else {
  //       setIsWrongChain(false);
  //     }
  //   });
  // }, []);

  // this works
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected && chainId !== PROJECT_CHAIN_ID) {
        console.log("chainId from changed" + chainId);
        setIsWrongChain(true);
      } else {
        setIsWrongChain(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [chainId]);

  const FetchLatestToken = async () => {
    try {
      const response = await TokensLatest();
      const newCreateTic = response.latestCreatedToken.ticker?.substring(0, 5);
      const newCreateUser = response.latestCreatedToken.creator?.substring(
        0,
        5,
      );
      const newCreateCid = response.latestCreatedToken.cid;
      const newCreateTokenAddress = response.latestCreatedToken.tokenAddress;
      const date = new Date(response.latestCreatedToken.createdAt);
      const formattedDate = `${String(date.getMonth() + 1).padStart(
        2,
        "0",
      )}/${String(date.getDate()).padStart(2, "0")}/${String(
        date.getFullYear(),
      ).slice(-2)}`;
      const newMintTic = response.latestMintedToken.ticker?.substring(0, 5);
      const newMintUser = response.latestMintedToken.user?.substring(0, 5);
      const newMintCid = response.latestMintedToken.cid;
      const newMintValue = Number(
        ethers.formatEther(response.latestMintedToken.reserveAmount),
      )
        .toFixed(4)
        .toString();
      const newMintTokenAddress = response.latestMintedToken.tokenAddress;

      const newBurnTic = response.latestBurnedToken.ticker?.substring(0, 5);
      const newBurnUser = response.latestBurnedToken.user?.substring(0, 5);
      const newBurnCid = response.latestBurnedToken.cid;
      const newBurnValue = Number(
        ethers.formatEther(response.latestBurnedToken.refundAmount),
      )
        .toFixed(4)
        .toString();
      const newBurnTokenAddress = response.latestBurnedToken.tokenAddress;
      if (
        newMintTic !== curMintTic ||
        newMintUser !== curMintUser ||
        newMintCid !== curMintCid ||
        newMintValue !== curMintValue ||
        newMintTokenAddress !== curMintTokenAddress
      ) {
        console.log("value changed!");
        setCurMintTic(newMintTic);
        setCurMintUser(newMintUser);
        setCurMintCid(newMintCid);
        setCurMintValue(newMintValue);
        setCurMintTokenAddress(newMintTokenAddress);
        setMintAnimationTrigger(true);
      }
      if (
        newCreateTic !== curCreateTic ||
        newCreateUser !== curCreateUser ||
        newCreateCid !== curCreateCid ||
        formattedDate !== curCreateTime ||
        newCreateTokenAddress !== curCreateTokenAddress
      ) {
        setCurCreateTic(newCreateTic);
        setCurCreateUser(newCreateUser);
        setCurCreateCid(newCreateCid);
        setCurCreateTime(formattedDate);
        setCurCreateTokenAddress(newCreateTokenAddress);
        setCreateAnimationTrigger(true); // Trigger animation
      }
      if (
        newBurnTic !== curBurnTic ||
        newBurnUser !== curBurnUser ||
        newBurnCid !== curBurnCid ||
        newBurnValue !== curBurnValue ||
        newBurnTokenAddress !== curBurnTokenAddress
      ) {
        setCurBurnTic(newBurnTic);
        setCurBurnUser(newBurnUser);
        setCurBurnCid(newBurnCid);
        setCurBurnTime(formattedDate);
        setCurBurnValue(newBurnValue);
        setCurBurnTokenAddress(newBurnTokenAddress);
        setBurnAnimationTrigger(true); // Trigger animation
      }
    } catch (error) {
      console.error(error);
    }
  };

  // GNB data update
  useEffect(() => {
    const interval = setInterval(() => {
      FetchLatestToken();
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [curMintTic, curMintUser, curMintCid, curMintValue, curMintTokenAddress]);

  // for animation
  useEffect(() => {
    if (mintAnimationTrigger) {
      const timeout = setTimeout(() => setMintAnimationTrigger(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [mintAnimationTrigger]);

  useEffect(() => {
    if (createAnimationTrigger) {
      const timeout = setTimeout(() => setCreateAnimationTrigger(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [createAnimationTrigger]);

  // useEffect(() => {
  //   setReserveMarketPriceIntoState();
  // }, []);

  // const setReserveMarketPriceIntoState = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://api.binance.com/api/v3/ticker/price?symbol=${RESERVE_SYMBOL}USDT`,
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const handleUrlClick = (url: string) => {
    if (url) {
      window.open(url);
    }
  };

  const WrongChainPopUpModal: FC = () => {
    return (
      <div className="fixed z-10 h-screen w-screen bg-black bg-opacity-70">
        <div className="absolute left-1/2 top-1/2 flex w-[334px] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-between gap-8 rounded-[10px] border bg-stone-900 py-[25px] text-center text-white md:h-[206px] md:w-[470px] md:px-10">
          <div className="flex flex-col gap-5">
            <h1 className="text-sm font-bold md:text-xl">
              Oops..wrong network
            </h1>
            <h1 className="text-xs md:text-sm">
              It seems you changed to wrong network..
            </h1>
          </div>

          <div
            onClick={openChainModal}
            className="flex h-[46px] w-[310px] cursor-pointer items-center justify-center rounded-[10px] border text-center text-sm font-bold md:h-[51px] md:rounded-2xl md:text-lg"
          >
            Change network to BASE
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isWrongChain && <WrongChainPopUpModal />}
      {isInfoModalActive && (
        <ModalRootWrapper
          onClick={() => setIsInfoModalActive(!isInfoModalActive)}
        >
          <ModalContentBox onClick={(e) => e.stopPropagation()}>
            <div className="mb-5 md:mb-[34px]">
              <div className="mb-5 text-sm font-bold md:mb-5 md:text-2xl">
                How it works
              </div>
              <div className="text-xs leading-6 md:text-[18px]">
                Memeslot prevents rugs by making sure that all created tokens
                are safe. Each coin on Memeslot is a fair-launch with no presale
                and no team allocation.
              </div>
            </div>

            <div className="mb-5 flex flex-col gap-[18px] md:mb-[34px] md:gap-[25px]">
              <div className="text-xs md:text-[18px]">
                <b>step 1</b> : pick a coin that you like
              </div>
              <div className="text-xs md:text-[18px]">
                <b>step 2</b> : buy the coin on the bonding curve
              </div>
              <div className="text-xs md:text-[18px]">
                <b>step 3</b> : sell at any time to lock in your profits or
                losses
              </div>
              <div className="text-xs leading-6 md:text-[18px]">
                <b>step 4</b> : once enough people buy, the coin reaches its set
                market cap threshold
              </div>
              <div className="px-12 text-xs leading-6 md:text-[18px] ">
                <b>step 5</b> : a portion of liquidity is deposited into DEX
                (e.g., Uniswap) and burned
              </div>
              <div className="px-5 text-xs leading-6 md:text-[18px]">
                <b>step 6</b> : enter your Telegram ID within 3 days of winning
                to claim your prize
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsInfoModalActive(!isInfoModalActive);
              }}
              className="h-[46px] w-full rounded-[10px] border text-sm font-bold hover:border-[#FAFF00] hover:text-[#FAFF00] md:h-[53px] md:text-xl"
            >
              Let&apos;s start
            </button>
          </ModalContentBox>
        </ModalRootWrapper>
      )}
      <div className="relative left-0 top-0 z-[50] flex h-14 w-screen bg-[#0E0E0E] md:h-[80px]" />
      <header className="fixed left-0 top-0 z-[50] flex h-14 w-screen bg-[#0E0E0E] md:h-[80px]">
        <div className="flex h-full w-full items-center justify-between px-2 md:px-7">
          <div className="flex h-[40px] w-full items-center justify-between px-5 text-white">
            <div className="flex h-full items-center justify-evenly gap-4 md:w-[300px] md:gap-[30px]">
              <Link href="/" className="flex items-center gap-2 rounded-full ">
                <img
                  src="/icons/logo.svg"
                  alt=""
                  // className="h-10 w-6 md:h-[40px] md:w-[40px]"
                />
              </Link>

              <div className="flex gap-3 md:gap-[30px]">
                <Telegram
                  // fill={isHoveredTG ? "#5E5E5E" : "white"}
                  className="h-4 w-4 cursor-pointer fill-[#5E5E5E] hover:fill-[#CFCFCF]"
                  onClick={() => handleUrlClick("https://t.me/rwe_bet")}
                />
                <X
                  className="cursor-pointer fill-[#5E5E5E] hover:fill-[#CFCFCF]"
                  onClick={() => handleUrlClick("https://twitter.com/rwe_bet")}
                />
                <Info
                  className="cursor-pointer fill-[#5E5E5E] hover:fill-[#CFCFCF]"
                  onClick={() => setIsInfoModalActive(!isInfoModalActive)}
                />
              </div>
            </div>
            <div
              className={`ml-14 hidden h-[40px] items-center md:inline`}
              style={{ width: `${width - 700}px` }}
            >
              <Slider
                elements={[
                  curMintUser && (
                    <MintAnimateWrapper
                      className={`mr-5 flex h-full items-center justify-center gap-[5px] rounded-[10px] border border-[#83FF80] px-[7px] text-[#83FF80] ${mintAnimationTrigger && "animate"}`}
                      key={1}
                    >
                      <BombBuy width={24} height={24} />
                      <h1 className="whitespace-nowrap text-sm">
                        {curMintUser} bought {curMintValue} ETH of
                      </h1>
                      <Link
                        href={curMintTokenAddress ? curMintTokenAddress : ""}
                      >
                        <h1 className="cursor-pointer text-sm hover:underline">
                          {curMintTic}
                        </h1>
                      </Link>
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curMintCid}`}
                        alt="img"
                        className="h-6 w-6 rounded-full border border-red-500"
                      />
                    </MintAnimateWrapper>
                  ),
                  curCreateUser && (
                    <CreateAnimateWrapper
                      className={`mr-5 flex h-full items-center justify-center gap-1  rounded-[10px] border border-[#09FFD3] px-[7px] text-[#09FFD3] ${createAnimationTrigger && "animate"}`}
                      key={2}
                    >
                      <BombCreate width={24} height={24} />
                      <div className="whitespace-nowrap text-sm">
                        {curCreateUser} Created
                      </div>
                      <Link
                        href={
                          curCreateTokenAddress ? curCreateTokenAddress : ""
                        }
                      >
                        <div className="cursor-pointer text-sm hover:underline">
                          {curCreateTic}
                        </div>
                      </Link>

                      <div className="whitespace-nowrap text-sm">
                        on {curCreateTime}
                      </div>
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curCreateCid}`}
                        alt="img"
                        className="h-6 w-6 rounded-full border border-red-500"
                      />
                    </CreateAnimateWrapper>
                  ),
                  curBurnUser && (
                    <BurnAnimateWrapper
                      className={`mr-5 flex h-full items-center justify-center gap-1  rounded-[10px] border border-[#fa00ff] px-[7px] text-[#fa00ff] ${burnAnimationTrigger && "animate"}`}
                      key={3}
                    >
                      <BombSold width={24} height={24} />
                      <div className="whitespace-nowrap text-sm">
                        {curBurnUser} sold {curBurnValue} of
                      </div>
                      <Link
                        href={curBurnTokenAddress ? curBurnTokenAddress : ""}
                      >
                        <div className="cursor-pointer text-sm hover:underline">
                          {curBurnTic}
                        </div>
                      </Link>
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curBurnCid}`}
                        alt="img"
                        className="h-6 w-6 rounded-full border border-red-500"
                      />
                    </BurnAnimateWrapper>
                  ),
                  curMintUser && (
                    <MintAnimateWrapper
                      className={`mr-5 flex h-full items-center justify-center gap-[5px] rounded-[10px] border border-[#83FF80] px-[7px] text-[#83FF80] ${mintAnimationTrigger && "animate"}`}
                      key={4}
                    >
                      <BombBuy width={24} height={24} />
                      <h1 className="whitespace-nowrap text-sm">
                        {curMintUser} bought {curMintValue} ETH of
                      </h1>
                      <Link
                        href={curMintTokenAddress ? curMintTokenAddress : ""}
                      >
                        <h1 className="cursor-pointer text-sm hover:underline">
                          {curMintTic}
                        </h1>
                      </Link>
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curMintCid}`}
                        alt="img"
                        className="h-6 w-6 rounded-full border border-red-500"
                      />
                    </MintAnimateWrapper>
                  ),
                  curCreateUser && (
                    <CreateAnimateWrapper
                      className={`mr-5 flex h-full items-center justify-center gap-1  rounded-[10px] border border-[#09FFD3] px-[7px] text-[#09FFD3] ${createAnimationTrigger && "animate"}`}
                      key={5}
                    >
                      <BombCreate width={24} height={24} />
                      <div className="whitespace-nowrap text-sm">
                        {curCreateUser} Created
                      </div>
                      <Link
                        href={
                          curCreateTokenAddress ? curCreateTokenAddress : ""
                        }
                      >
                        <div className="cursor-pointer text-sm hover:underline">
                          {curCreateTic}
                        </div>
                      </Link>

                      <div className="whitespace-nowrap text-sm">
                        on {curCreateTime}
                      </div>
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curCreateCid}`}
                        alt="img"
                        className="h-6 w-6 rounded-full border border-red-500"
                      />
                    </CreateAnimateWrapper>
                  ),
                  curBurnUser && (
                    <BurnAnimateWrapper
                      className={`mr-5 flex h-full items-center justify-center gap-1  rounded-[10px] border border-[#fa00ff] px-[7px] text-[#fa00ff] ${burnAnimationTrigger && "animate"}`}
                      key={6}
                    >
                      <BombSold width={24} height={24} />
                      <div className="whitespace-nowrap text-sm">
                        {curBurnUser} sold {curBurnValue} of
                      </div>
                      <Link
                        href={curBurnTokenAddress ? curBurnTokenAddress : ""}
                      >
                        <div className="cursor-pointer text-sm hover:underline">
                          {curBurnTic}
                        </div>
                      </Link>
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curBurnCid}`}
                        alt="img"
                        className="h-6 w-6 rounded-full border border-red-500"
                      />
                    </BurnAnimateWrapper>
                  ),
                ]}
              />
            </div>
            <div
              className="relative flex select-none flex-row-reverse items-center md:w-[300px]"
              ref={modalRef}
            >
              {isConnected ? (
                <>
                  <div className="z-40 hidden h-10 items-center justify-between rounded-lg border border-secondary px-5 text-sm font-bold text-[#FAFF00] md:flex">
                    <div
                      onClick={() => copyToClipboard(address || "")}
                      className={`flex cursor-pointer items-center gap-2 stroke-transparent hover:stroke-[#FF2626] hover:text-[#FF2626] active:stroke-black active:text-black`}
                    >
                      <Bomb
                        className="h-[24px] w-[24px] stroke-none"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                      />
                      <div
                        className={`absolute duration-1000 ${disconnectToggle ? "w-[130px]" : "w-0"} right-11 flex h-6 items-center justify-center overflow-hidden rounded-full bg-secondary stroke-third text-[15px] text-third hover:bg-[#FF2626] hover:stroke-secondary hover:text-secondary`}
                        onClick={openAccountModal}
                      >
                        {disconnectToggle && "Disconnect"}
                        <Power className={`ml-1`} />
                      </div>
                      {address?.substring(0, 6) + "..."}
                      {<Copy />}
                    </div>
                    <div className="flex gap-2">
                      <Power
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        className={`h-[24px] w-[24px] cursor-pointer stroke-secondary hover:stroke-third`}
                        onClick={() => setDisconnectToggle(true)}
                      />
                      <div
                        className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center"
                        onClick={() =>
                          setAccountButtonModal(!accountButtonModal)
                        }
                      >
                        <DownArrow
                          className={`transform ${accountButtonModal && "rotate-180"} fill-secondary hover:fill-third`}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-md border-4 border-[#FF2626] bg-secondary px-1 py-0.5 md:hidden"
                    onClick={() => setAccountButtonModal(!accountButtonModal)}
                  >
                    <img
                      src={
                        connector?.icon ||
                        "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjMzIiB2aWV3Qm94PSIwIDAgMzUgMzMiIHdpZHRoPSIzNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjI1Ij48cGF0aCBkPSJtMzIuOTU4MiAxLTEzLjEzNDEgOS43MTgzIDIuNDQyNC01LjcyNzMxeiIgZmlsbD0iI2UxNzcyNiIgc3Ryb2tlPSIjZTE3NzI2Ii8+PGcgZmlsbD0iI2UyNzYyNSIgc3Ryb2tlPSIjZTI3NjI1Ij48cGF0aCBkPSJtMi42NjI5NiAxIDEzLjAxNzE0IDkuODA5LTIuMzI1NC01LjgxODAyeiIvPjxwYXRoIGQ9Im0yOC4yMjk1IDIzLjUzMzUtMy40OTQ3IDUuMzM4NiA3LjQ4MjkgMi4wNjAzIDIuMTQzNi03LjI4MjN6Ii8+PHBhdGggZD0ibTEuMjcyODEgMjMuNjUwMSAyLjEzMDU1IDcuMjgyMyA3LjQ2OTk0LTIuMDYwMy0zLjQ4MTY2LTUuMzM4NnoiLz48cGF0aCBkPSJtMTAuNDcwNiAxNC41MTQ5LTIuMDc4NiAzLjEzNTggNy40MDUuMzM2OS0uMjQ2OS03Ljk2OXoiLz48cGF0aCBkPSJtMjUuMTUwNSAxNC41MTQ5LTUuMTU3NS00LjU4NzA0LS4xNjg4IDguMDU5NzQgNy40MDQ5LS4zMzY5eiIvPjxwYXRoIGQ9Im0xMC44NzMzIDI4Ljg3MjEgNC40ODE5LTIuMTYzOS0zLjg1ODMtMy4wMDYyeiIvPjxwYXRoIGQ9Im0yMC4yNjU5IDI2LjcwODIgNC40Njg5IDIuMTYzOS0uNjEwNS01LjE3MDF6Ii8+PC9nPjxwYXRoIGQ9Im0yNC43MzQ4IDI4Ljg3MjEtNC40NjktMi4xNjM5LjM2MzggMi45MDI1LS4wMzkgMS4yMzF6IiBmaWxsPSIjZDViZmIyIiBzdHJva2U9IiNkNWJmYjIiLz48cGF0aCBkPSJtMTAuODczMiAyOC44NzIxIDQuMTU3MiAxLjk2OTYtLjAyNi0xLjIzMS4zNTA4LTIuOTAyNXoiIGZpbGw9IiNkNWJmYjIiIHN0cm9rZT0iI2Q1YmZiMiIvPjxwYXRoIGQ9Im0xNS4xMDg0IDIxLjc4NDItMy43MTU1LTEuMDg4NCAyLjYyNDMtMS4yMDUxeiIgZmlsbD0iIzIzMzQ0NyIgc3Ryb2tlPSIjMjMzNDQ3Ii8+PHBhdGggZD0ibTIwLjUxMjYgMjEuNzg0MiAxLjA5MTMtMi4yOTM1IDIuNjM3MiAxLjIwNTF6IiBmaWxsPSIjMjMzNDQ3IiBzdHJva2U9IiMyMzM0NDciLz48cGF0aCBkPSJtMTAuODczMyAyOC44NzIxLjY0OTUtNS4zMzg2LTQuMTMxMTcuMTE2N3oiIGZpbGw9IiNjYzYyMjgiIHN0cm9rZT0iI2NjNjIyOCIvPjxwYXRoIGQ9Im0yNC4wOTgyIDIzLjUzMzUuNjM2NiA1LjMzODYgMy40OTQ2LTUuMjIxOXoiIGZpbGw9IiNjYzYyMjgiIHN0cm9rZT0iI2NjNjIyOCIvPjxwYXRoIGQ9Im0yNy4yMjkxIDE3LjY1MDctNy40MDUuMzM2OS42ODg1IDMuNzk2NiAxLjA5MTMtMi4yOTM1IDIuNjM3MiAxLjIwNTF6IiBmaWxsPSIjY2M2MjI4IiBzdHJva2U9IiNjYzYyMjgiLz48cGF0aCBkPSJtMTEuMzkyOSAyMC42OTU4IDIuNjI0Mi0xLjIwNTEgMS4wOTEzIDIuMjkzNS42ODg1LTMuNzk2Ni03LjQwNDk1LS4zMzY5eiIgZmlsbD0iI2NjNjIyOCIgc3Ryb2tlPSIjY2M2MjI4Ii8+PHBhdGggZD0ibTguMzkyIDE3LjY1MDcgMy4xMDQ5IDYuMDUxMy0uMTAzOS0zLjAwNjJ6IiBmaWxsPSIjZTI3NTI1IiBzdHJva2U9IiNlMjc1MjUiLz48cGF0aCBkPSJtMjQuMjQxMiAyMC42OTU4LS4xMTY5IDMuMDA2MiAzLjEwNDktNi4wNTEzeiIgZmlsbD0iI2UyNzUyNSIgc3Ryb2tlPSIjZTI3NTI1Ii8+PHBhdGggZD0ibTE1Ljc5NyAxNy45ODc2LS42ODg2IDMuNzk2Ny44NzA0IDQuNDgzMy4xOTQ5LTUuOTA4N3oiIGZpbGw9IiNlMjc1MjUiIHN0cm9rZT0iI2UyNzUyNSIvPjxwYXRoIGQ9Im0xOS44MjQyIDE3Ljk4NzYtLjM2MzggMi4zNTg0LjE4MTkgNS45MjE2Ljg3MDQtNC40ODMzeiIgZmlsbD0iI2UyNzUyNSIgc3Ryb2tlPSIjZTI3NTI1Ii8+PHBhdGggZD0ibTIwLjUxMjcgMjEuNzg0Mi0uODcwNCA0LjQ4MzQuNjIzNi40NDA2IDMuODU4NC0zLjAwNjIuMTE2OS0zLjAwNjJ6IiBmaWxsPSIjZjU4NDFmIiBzdHJva2U9IiNmNTg0MWYiLz48cGF0aCBkPSJtMTEuMzkyOSAyMC42OTU4LjEwNCAzLjAwNjIgMy44NTgzIDMuMDA2Mi42MjM2LS40NDA2LS44NzA0LTQuNDgzNHoiIGZpbGw9IiNmNTg0MWYiIHN0cm9rZT0iI2Y1ODQxZiIvPjxwYXRoIGQ9Im0yMC41OTA2IDMwLjg0MTcuMDM5LTEuMjMxLS4zMzc4LS4yODUxaC00Ljk2MjZsLS4zMjQ4LjI4NTEuMDI2IDEuMjMxLTQuMTU3Mi0xLjk2OTYgMS40NTUxIDEuMTkyMSAyLjk0ODkgMi4wMzQ0aDUuMDUzNmwyLjk2Mi0yLjAzNDQgMS40NDItMS4xOTIxeiIgZmlsbD0iI2MwYWM5ZCIgc3Ryb2tlPSIjYzBhYzlkIi8+PHBhdGggZD0ibTIwLjI2NTkgMjYuNzA4Mi0uNjIzNi0uNDQwNmgtMy42NjM1bC0uNjIzNi40NDA2LS4zNTA4IDIuOTAyNS4zMjQ4LS4yODUxaDQuOTYyNmwuMzM3OC4yODUxeiIgZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2Ii8+PHBhdGggZD0ibTMzLjUxNjggMTEuMzUzMiAxLjEwNDMtNS4zNjQ0Ny0xLjY2MjktNC45ODg3My0xMi42OTIzIDkuMzk0NCA0Ljg4NDYgNC4xMjA1IDYuODk4MyAyLjAwODUgMS41Mi0xLjc3NTItLjY2MjYtLjQ3OTUgMS4wNTIzLS45NTg4LS44MDU0LS42MjIgMS4wNTIzLS44MDM0eiIgZmlsbD0iIzc2M2UxYSIgc3Ryb2tlPSIjNzYzZTFhIi8+PHBhdGggZD0ibTEgNS45ODg3MyAxLjExNzI0IDUuMzY0NDctLjcxNDUxLjUzMTMgMS4wNjUyNy44MDM0LS44MDU0NS42MjIgMS4wNTIyOC45NTg4LS42NjI1NS40Nzk1IDEuNTE5OTcgMS43NzUyIDYuODk4MzUtMi4wMDg1IDQuODg0Ni00LjEyMDUtMTIuNjkyMzMtOS4zOTQ0eiIgZmlsbD0iIzc2M2UxYSIgc3Ryb2tlPSIjNzYzZTFhIi8+PHBhdGggZD0ibTMyLjA0ODkgMTYuNTIzNC02Ljg5ODMtMi4wMDg1IDIuMDc4NiAzLjEzNTgtMy4xMDQ5IDYuMDUxMyA0LjEwNTItLjA1MTloNi4xMzE4eiIgZmlsbD0iI2Y1ODQxZiIgc3Ryb2tlPSIjZjU4NDFmIi8+PHBhdGggZD0ibTEwLjQ3MDUgMTQuNTE0OS02Ljg5ODI4IDIuMDA4NS0yLjI5OTQ0IDcuMTI2N2g2LjExODgzbDQuMTA1MTkuMDUxOS0zLjEwNDg3LTYuMDUxM3oiIGZpbGw9IiNmNTg0MWYiIHN0cm9rZT0iI2Y1ODQxZiIvPjxwYXRoIGQ9Im0xOS44MjQxIDE3Ljk4NzYuNDQxNy03LjU5MzIgMi4wMDA3LTUuNDAzNGgtOC45MTE5bDIuMDAwNiA1LjQwMzQuNDQxNyA3LjU5MzIuMTY4OSAyLjM4NDIuMDEzIDUuODk1OGgzLjY2MzVsLjAxMy01Ljg5NTh6IiBmaWxsPSIjZjU4NDFmIiBzdHJva2U9IiNmNTg0MWYiLz48L2c+PC9zdmc+"
                      }
                      alt="icon"
                      className="h-4 w-4"
                    />
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={openConnectModal}
                    className="connect-wallet hidden h-[40px] w-[180px] cursor-pointer rounded-[10px] border  md:block"
                  >
                    Connect Wallet
                  </button>
                  <Wallet
                    className="cursor-pointer md:hidden"
                    onClick={openConnectModal}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {accountButtonModal &&
        (width < 768 ? (
          <BottomSheet
            {...{
              setUnVisible: ModalOff,
              visible: accountButtonModal,
            }}
          >
            <MypageModal
              {...{
                setModal: setAccountButtonModal,
                openAccountModal,
                userAddress: address,
              }}
            />
          </BottomSheet>
        ) : (
          // <ModalRootWrapperWallet onClick={ModalOff}>
          <MypageModal
            {...{
              setModal: setAccountButtonModal,
              userAddress: address,
            }}
          />
          // </ModalRootWrapperWallet>
        ))}
      <div className="mt-2.5 flex h-12 items-center gap-[20px] md:hidden">
        <Slider
          elements={[
            curMintCid && (
              <MintAnimateWrapper
                key={1}
                className={`flex h-10 items-center justify-center gap-[5px] rounded-[10px] border border-[#83FF80] px-[7px] text-[#83FF80] ${mintAnimationTrigger && "animate"} mr-2.5 shadow-md`}
              >
                <BombBuy width={24} height={24} />
                <h1 className="text-sm">
                  {curMintUser} bought {curMintValue} ETH of
                </h1>
                <Link href={curMintTokenAddress ? curMintTokenAddress : ""}>
                  <h1 className="cursor-pointer text-sm hover:underline">
                    {curMintTic}
                  </h1>
                </Link>
                <div className="h-[18px] w-[18px] overflow-hidden rounded-full border border-red-500">
                  <img
                    src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curMintCid}`}
                    alt="img"
                  />
                </div>
              </MintAnimateWrapper>
            ),
            curCreateCid && (
              <CreateAnimateWrapper
                key={2}
                className={`flex h-10 items-center justify-center gap-[5px] rounded-[10px] border border-[#00FFE0] px-[7px] text-[#00FFE0] ${createAnimationTrigger && "animate"} mr-2.5`}
              >
                <BombCreate width={24} height={24} />
                <h1 className="text-sm">{curCreateUser} Created</h1>
                <Link href={curCreateTokenAddress ? curCreateTokenAddress : ""}>
                  <h1 className="cursor-pointer text-sm hover:underline">
                    {curCreateTic}
                  </h1>
                </Link>

                <h1 className="text-sm">on {curCreateTime}</h1>
                <div className="h-[18px] w-[18px] overflow-hidden rounded-full border border-red-500">
                  <img
                    src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curCreateCid}`}
                    alt="img"
                  />
                </div>
              </CreateAnimateWrapper>
            ),
            curBurnUser && (
              <BurnAnimateWrapper
                className={`flex h-10 items-center justify-center gap-[5px] rounded-[10px] border border-[#fa00ff] px-[7px] text-[#fa00ff] ${burnAnimationTrigger && "animate"} mr-2.5`}
                key={3}
              >
                <BombSold width={24} height={24} />
                <div className="whitespace-nowrap text-sm">
                  {curBurnUser} sold {curBurnValue} of
                </div>
                <Link href={curBurnTokenAddress ? curBurnTokenAddress : ""}>
                  <div className="cursor-pointer text-sm hover:underline">
                    {curBurnTic}
                  </div>
                </Link>
                <img
                  src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curBurnCid}`}
                  alt="img"
                  className="h-6 w-6 rounded-full border border-red-500"
                />
              </BurnAnimateWrapper>
            ),
          ]}
        />
      </div>
    </>
  );
};

export default Header;

const eventCardColors: string[] = ["9EFF00", "00FFFF", "FF20F6"];

const shake = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(5deg);
    animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
  }
  25%, 75% {
    transform: translateY(-12px);
    animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
  }
  50% {
    transform: translateY(12px) rotate(-5deg);
    animation-timing-function: cubic-bezier(0, 0.2, 0.8, 1);
  }
`;

const colorReverseBuy = keyframes`
  0%, 100% {
    background:#0E0E0E;
    box-shadow: 0px 0px 8px 0px #83ff80;
    color: #83ff80;
  }
  15%, 85% {
    background:#83ff80;
    box-shadow: 0px 0px 8px 0px #83ff80;
    color: white;
  }
`;
const colorReverseCreate = keyframes`
  0%, 100% {
    background:#0E0E0E;
    box-shadow: 0px 0px 8px 0px #00FFE0;
    color: #00FFE0;
  }
  15%, 85% {
    background:#00FFE0;
    box-shadow: 0px 0px 8px 0px #00FFE0;
    color: white;
  }
`;
const colorReverseBurn = keyframes`
  0%, 100% {
    background:#0E0E0E;
    box-shadow: 0px 0px 8px 0px #fa00ff;
    color: #fa00ff;
  }
  15%, 85% {
    background:#fa00ff;
    box-shadow: 0px 0px 8px 0px #fa00ff;
    color: white;
  }
`;
const MintAnimateWrapper = styled.div`
  background: #0e0e0e;
  box-shadow: 0px 0px 8px 0px #83ff80;
  color: #83ff80;

  &.animate {
    animation:
      ${shake} 250ms 0s 3,
      ${colorReverseBuy} 1s 0s;
  }
`;

const CreateAnimateWrapper = styled.div`
  box-shadow: 0px 0px 8px 0px #00ffe0;
  color: #00ffe0;

  &.animate {
    animation: ${colorReverseCreate} 1s 0s;
  }
`;
const BurnAnimateWrapper = styled.div`
  box-shadow: 0px 0px 8px 0px #fa00ff;
  color: #fa00ff;

  &.animate {
    animation: ${colorReverseBurn} 1s 0s;
  }
`;
