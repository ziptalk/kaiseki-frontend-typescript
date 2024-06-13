"use client";

import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";
import endpoint from "@/global/endpoint";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { ModalContentBox, ModalRootWrapper } from "./Modal";
import rpcProvider from "@/global/rpcProvider";
import styled, { keyframes } from "styled-components";
import { useAccount, useChainId } from "wagmi";

const Header: FC = () => {
  //MARK: - Detect chain
  useEffect(() => {
    window.ethereum?.on("chainChanged", (chainId: any) => {
      if (chainId != 0xae3f3) {
        console.log("chainId from changed" + chainId);
        setIsWrongChain(true);
        console.log("changed wrong");
      } else {
        setIsWrongChain(false);
      }
    });
    window.ethereum?.on("connect", (chainId: any) => {
      if (chainId != 0xae3f3) {
        setIsWrongChain(true);
        console.log("connect wrong");
        console.log("chainId from connect" + chainId);
      }
    });
  }, []);

  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { address } = useAccount();

  const chainId = useChainId();
  const [curMintValue, setCurMintValue] = useState("0.1043");
  const [curMintTic, setCurMintTic] = useState("MEME");
  const [curMintUser, setCurMintUser] = useState("0x7A2");
  const [curMintCid, setCurMintCid] = useState(
    "QmT9jVuYbem8pJpMVtcEqkFRDBqjinEsaDtm6wz9R8VuKC",
  );
  const [curCreateTic, setCurCreateTic] = useState("MEME");
  const [curCreateUser, setCurCreateUser] = useState("0x7A2");
  const [curCreateTime, setCurCreateTime] = useState("Date");
  const [curCreateCid, setCurCreateCid] = useState(
    "QmT9jVuYbem8pJpMVtcEqkFRDBqjinEsaDtm6wz9R8VuKC",
  );
  const [curCreateTokenAddress, setCurCreateTokenAddress] = useState("");
  const [curMintTokenAddress, setCurMintTokenAddress] = useState("");
  const [accountButtonModal, setAccountButtonModal] = useState(false);

  // Initialize ethers with a provider
  const { ethers } = require("ethers");
  const MODAL_VISIBLE_STORAGE_KEY = "isFirstVisitToMemesino";

  useEffect(() => {
    localStorage.setItem("isFetching", "false");
    localStorage.setItem("isFetchingCreate", "false");
  }, []);

  const [isWrongChain, setIsWrongChain] = useState(false);

  useEffect(() => {
    fetch(`${endpoint}/homeTokenInfo?page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // console.log(data);
          setCurCreateTic(data[0].ticker.substring(0, 5));
          setCurCreateUser(data[0].createdBy.substring(0, 5));
          setCurCreateCid(data[0].cid);
          setCurCreateTokenAddress(data[0].tokenAddress);
          const date = new Date(data[0].timestamp);
          const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`; // Fake value!
          setCurCreateTime(formattedDate);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${endpoint}/TxlogsMintBurn`)
        .then((response) => response.json())
        .then((data) => {
          const evs = data.mintEvents.reverse()[0];

          // console.log(
          //   ethers.formatEther(evs.amountMinted._hex, 16).toString() + "evs",
          // );

          const newMintTic = evs.token.ticker.substring(0, 5);
          const newMintUser = evs.user.substring(0, 5);
          const newMintCid = evs.token.cid;
          const newMintValue = Number(
            ethers.formatEther(evs.reserveAmount._hex, 16),
          )
            .toFixed(4)
            .toString();

          const newMintTokenAddress = evs.token.tokenAddress;

          // Check if values have changed before updating state
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
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 5000); // Fetch every 5 seconds (adjust as needed)

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [curMintTic, curMintUser, curMintCid, curMintValue, curMintTokenAddress]);

  useEffect(() => {
    if (chainId != 713715) {
      setIsWrongChain(true);
    }
  }, [chainId]);

  const MintEventCard: FC<EventCardTypes> = ({ user, value, ticker }) => {
    return (
      <EventWrapper>
        {/* // <EventWrapper $itemN={index}> */}
        <div className="flex h-[18px] w-full gap-[3px] ">
          {/* TODO: 유저 프로필 이미지 하드코딩중. 추후 해당 유저 프로필로 변경 필요 */}
          <Image
            width={18}
            height={18}
            className="rounded-full "
            src="/images/Seiyan.png"
            alt="user profile"
          />
          <h1 className="text-sm">{user} bought </h1>
        </div>
        <div className="flex h-[18px] w-full justify-end gap-[3px]">
          <h1 className="text-sm">
            {" "}
            {value} SEI of {ticker}
          </h1>
          <Image
            width={18}
            height={18}
            className="rounded-full "
            src="/images/Seiyan.png"
            alt="user profile"
          />
        </div>
      </EventWrapper>
    );
  };

  const CreateEventCard: FC<EventCardTypes> = ({
    index,
    user,
    ticker,
    time,
  }) => {
    return (
      <EventWrapper $itemN={index}>
        <div className="flex h-[18px] w-full gap-[3px] ">
          {/* TODO: 유저 프로필 이미지 하드코딩중. 추후 해당 유저 프로필로 변경 필요 */}
          <Image
            width={18}
            height={18}
            className="rounded-full "
            src="/images/Seiyan.png"
            alt="user profile"
          />
          <h1 className="text-sm">{user} created </h1>
        </div>
        <div className="flex h-[18px] w-full justify-end gap-[3px]">
          <h1 className="text-sm">
            {ticker} on {time}
          </h1>
          <Image
            width={18}
            height={18}
            className="rounded-full "
            src="/images/Seiyan.png"
            alt="user profile"
          />
        </div>
      </EventWrapper>
    );
  };

  function setModalVisible() {
    if (!window.localStorage.getItem(MODAL_VISIBLE_STORAGE_KEY)) {
      setInfoModal(true);
      window.localStorage.setItem(MODAL_VISIBLE_STORAGE_KEY, "false");
    }
  }

  const handleClick = (url: string) => {
    if (url) {
      window.open(url);
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [isHoveredTG, setIsHoveredTG] = useState(false);

  const handleMouseEnterTG = () => {
    setIsHoveredTG(true);
  };

  const handleMouseLeaveTG = () => {
    setIsHoveredTG(false);
  };

  const [isHoveredIF, setIsHoveredIF] = useState(false);

  const handleMouseEnterIF = () => {
    setIsHoveredIF(true);
  };

  const handleMouseLeaveIF = () => {
    setIsHoveredIF(false);
  };
  const [infoModal, setInfoModal] = useState(false);
  const [curSeiPrice, setCurSeiPrice] = useState(0.5423);

  useEffect(() => {
    const getSeiPrice = async () => {
      try {
        const response = await axios.get(
          `https://api.binance.com/api/v3/ticker/price?symbol=SEIUSDT`,
        );
        // console.log("SEI PRICE" + response.data.price);
        setCurSeiPrice(response.data.price);
      } catch (error) {
        console.log(error);
      }
    };

    getSeiPrice();
  }, []);
  return (
    <>
      {isWrongChain && (
        <div className="fixed z-[10000] h-screen w-screen bg-black bg-opacity-70">
          <div className="absolute left-1/2 top-1/2 flex h-[206px] w-[535px] -translate-x-1/2 -translate-y-1/2 transform flex-col justify-between rounded-[10px] border bg-stone-900 px-10 py-[25px] text-center text-white">
            <div className="]">
              <h1 className="mb-[20px] text-2xl">Oops..wrong network 😞</h1>
              <h1>It seems you changed to wrong network..</h1>
            </div>

            <div
              onClick={openChainModal}
              className=" cursor-pointer rounded-[10px] border py-[15px] text-center text-xl"
            >
              Change Network to SEI
            </div>
          </div>
        </div>
      )}
      {infoModal && (
        <ModalRootWrapper onClick={() => setInfoModal(!infoModal)}>
          <ModalContentBox onClick={(e) => e.stopPropagation()}>
            <div className="mb-[34px] h-[111px] gap-[20px]">
              <h1 className="mb-[20px] text-2xl">How it works</h1>
              <h1>
                Memesino prevents rugs by making sure that all created tokens
                are safe. Each coin on Memesino is a fair-launch with no presale
                and no team allocation.
              </h1>
            </div>

            <div className=" mb-[34px] h-[247px] gap-[20px]">
              <h1 className="mb-[20px]">step 1 : pick a coin that you like</h1>
              <h1 className="mb-[20px]">
                step 2 : buy the coin on the bonding curve
              </h1>
              <h1 className="mb-[20px]">
                step 3 : sell at any time to lock in your profits or losses
              </h1>
              <h1 className="mb-[20px]">
                step 4 : when enough people buy on the bonding curve it reaches
                a market cap of ${Math.floor((60660 * curSeiPrice) / 1000)}k
              </h1>
              <h1 className="mb-[20px]">
                step 5 : ${Math.floor((9000 * curSeiPrice) / 1000)}k of
                liquidity is then deposited in dragonswap and burned
              </h1>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setInfoModal(!infoModal);
              }}
              className="h-[53px] w-full rounded-[10px] border hover:border-[#FAFF00] hover:text-[#FAFF00]"
            >
              Let&apos;s start
            </button>
          </ModalContentBox>
        </ModalRootWrapper>
      )}
      <header className="sticky left-0 top-0 z-[9999] flex h-[80px] w-screen bg-[#0E0E0E]">
        {/* {pathname == "/" && (
          <div className="absolute left-0 top-[130px] flex h-[80vh] w-[15vw] justify-center gap-[40px]  ">
            <div className="h-full overflow-hidden">
              {datas.map((card: any, index: any) => (
                <MintEventCard
                  key={index}
                  value={card.val}
                  ticker={card.tic}
                  user={card.user}
                  index={index}
                />
              ))}
            </div>
          </div>
        )} */}

        <div className="flex h-full w-full items-center justify-between px-[30px]">
          <div className="flex h-[40px] w-full items-center justify-between px-2 text-white">
            <div className="flex h-full w-[300px] items-center justify-evenly gap-[30px]">
              <Link
                href="/"
                className="flex h-[40px] items-center gap-[15px] rounded-full "
              >
                <Image
                  src="/images/memeLogo.png"
                  alt=""
                  width={200}
                  height={200}
                  className="h-[29px] w-[26px]"
                />
                <Image
                  src="/images/Memesino.png"
                  alt=""
                  width={400}
                  height={400}
                  className="h-[28px] w-[94px]"
                />
              </Link>

              <div className="flex gap-[30px]">
                <Image
                  src={
                    isHovered
                      ? "/icons/telegram-hover.svg"
                      : "/icons/telegram_logo.svg"
                  }
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px] cursor-pointer"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick("https://t.me/memesinodotfun")}
                />

                <Image
                  src={isHoveredTG ? "/icons/x-hover.svg" : "/icons/X_logo.svg"}
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px] cursor-pointer"
                  onMouseEnter={handleMouseEnterTG}
                  onMouseLeave={handleMouseLeaveTG}
                  onClick={() =>
                    handleClick("https://twitter.com/memesinodotfun")
                  }
                />

                <Image
                  src={
                    isHoveredIF ? "/icons/info-hover.svg" : "/icons/info.svg"
                  }
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px] cursor-pointer"
                  onMouseEnter={handleMouseEnterIF}
                  onMouseLeave={handleMouseLeaveIF}
                  onClick={() => setInfoModal(!infoModal)}
                />
              </div>
            </div>
            <div className="flex h-[40px] items-center gap-[20px]">
              <PinkAnimatedWrapper className="flex h-full items-center justify-center gap-[5px] rounded-[10px] border border-[#FA00FF] px-[7px] text-[#FA00FF]">
                <div className="h-[18px] w-[18px] rounded-full ">
                  <Image
                    src="/images/memesinoGhost.png"
                    alt=""
                    height={18}
                    width={18}
                    style={{ width: 18, height: 18 }}
                  />
                </div>

                <h1 className="text-sm">
                  {curMintUser} bought {curMintValue} SEI of
                </h1>
                <Link href={curMintTokenAddress ? curMintTokenAddress : ""}>
                  <h1 className="cursor-pointer text-sm hover:underline">
                    {curMintTic}
                  </h1>
                </Link>
                <div className="h-[18px] w-[18px] overflow-hidden rounded-full bg-[#FA00FF]">
                  <img
                    src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curMintCid}`}
                    alt="img"
                  />
                </div>
              </PinkAnimatedWrapper>
              <MintWrapper className="flex h-full items-center justify-center gap-[5px] rounded-[10px] border border-[#09FFD3] px-[7px] text-[#09FFD3]">
                <div className="h-[18px] w-[18px] rounded-full ">
                  <Image
                    src="/images/memesinoGhost.png"
                    alt=""
                    height={18}
                    width={18}
                  />
                </div>
                <h1 className="text-sm">{curCreateUser} Created</h1>
                <Link href={curCreateTokenAddress ? curCreateTokenAddress : ""}>
                  <h1 className="cursor-pointer text-sm hover:underline">
                    {curCreateTic}
                  </h1>
                </Link>

                <h1 className="text-sm">on {curCreateTime}</h1>
                <div className="h-[18px] w-[18px] overflow-hidden rounded-full bg-[#09FFD3]">
                  <img
                    src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curCreateCid}`}
                    alt="img"
                  />
                </div>
              </MintWrapper>
            </div>
            <div className="relative flex w-[300px] flex-row-reverse items-center">
              {/* <ConnectButton /> */}

              {address ? (
                <button
                  onClick={() => setAccountButtonModal(!accountButtonModal)}
                  className="flex h-[40px] w-[180px]
                  cursor-pointer
                  items-center justify-center gap-[9px] rounded-[10px] border text-[12px] font-normal text-white"
                >
                  <Image
                    src="/images/memesinoGhost.png"
                    alt=""
                    height={18}
                    width={18}
                  />
                  {address?.substring(0, 7)}
                  <Image
                    src="/icons/DownTri.svg"
                    alt=""
                    width={18}
                    height={18}
                    style={{ width: 18, height: 18 }}
                  />
                </button>
              ) : (
                <button
                  onClick={openConnectModal}
                  className="h-[40px] w-[180px] cursor-pointer rounded-[10px] border text-[12px] text-white"
                >
                  Connect Wallet
                </button>
              )}
              {accountButtonModal && (
                <>
                  <div className="absolute right-[8px] top-[55px] h-[94px] w-[165px] rounded-[10px] border border-white bg-[#0E0E0E] px-[13px] py-[15px] text-center">
                    <div
                      onClick={openAccountModal}
                      className="cursor-pointer border-b border-white pb-[10px] text-[15px]"
                    >
                      <h1>My account</h1>
                    </div>
                    <div
                      onClick={openChainModal}
                      className="cursor-pointer pt-[10px] text-[15px]"
                    >
                      <h1>Change network</h1>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* {pathname == "/" && (
          <div className="absolute right-0 top-[130px] flex h-[80vh] w-[15vw] justify-center ">
            <div className="h-full overflow-hidden">
              {createDatas.map((card: any, index: any) => (
                <CreateEventCard
                  key={index}
                  time={card.time}
                  ticker={card.tic}
                  user={card.user}
                  index={index}
                />
              ))}
            </div>
          </div>
        )} */}
      </header>
    </>
  );
};

export default Header;

const ImageSNS = styled.img`
  height: 15px;
`;

const ImageX = styled(ImageSNS)`
  content: url("/icons/X_logo.svg");
  &:hover {
    content: url("/icons/x-hover.svg");
  }
`;

const ImageTG = styled(ImageSNS)`
  content: url("/icons/telegram_logo.svg");
  &:hover {
    content: url("/icons/telegram-hover.svg");
  }
`;

// const ImageInfo = styled(ImageSNS)`
//   content: url("/icons/info.svg");
//   &:hover {
//     content: url("/icons/info-hover.svg");
//   }
// `;

const eventCardColors: string[] = ["9EFF00", "00FFFF", "FF20F6"];

const EventWrapper = styled.div<{ $itemN?: number }>`
  width: 182px;
  height: 55px;
  margin-bottom: 20px;
  padding: 8px 15px;
  border-radius: 8px;

  background-color: ${({ $itemN }) =>
    $itemN ? `#${eventCardColors[$itemN % 3]}` : "#0FF"};
`;

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

const colorReversePink = keyframes`
  0%, 100% {
    background:#0E0E0E;
    box-shadow: 0px 0px 8px 0px #FA00FF;
    color: #FA00FF;
  }
  15%, 85% {
    background:#FA00FF;
    box-shadow: 0px 0px 8px 0px #FA00FF;
    color: white;
  }
`;
const colorReverseMint = keyframes`
  0%, 100% {
    background:#0E0E0E;
    box-shadow: 0px 0px 8px 0px #09ffd3;
    color: #09ffd3;
  }
  15%, 85% {
    background:#B3FFF6;
    box-shadow: 0px 0px 8px 0px #FA00FF;
    border: 1px solid #fa00ff;
    color: #FA00FF;
  }
`;

const PinkAnimatedWrapper = styled.div`
  background: #0e0e0e;
  box-shadow: 0px 0px 8px 0px #fa00ff;
  color: #fa00ff;

  animation:
    ${shake} 250ms 0s 3,
    ${colorReversePink} 1s 0s;
`;

const MintWrapper = styled.div`
  box-shadow: 0px 0px 8px 0px #09ffd3;
  color: #09ffd3;

  animation: ${colorReverseMint} 1s 0s;
`;
