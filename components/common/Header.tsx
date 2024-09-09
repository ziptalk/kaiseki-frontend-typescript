"use client";
import { FC, useEffect, useRef, useState } from "react";
import {
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import styled, { keyframes } from "styled-components";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { ModalContentBox, ModalRootWrapper } from "./Modal";

import {
  PROJECT_CHAIN_ID,
  RESERVE_SYMBOL,
  SERVER_ENDPOINT,
} from "@/global/projectConfig";
import X from "@/public/icons/X_logo.svg";
import Info from "@/public/icons/info.svg";
import DownArrow from "@/public/icons/dwnArrow.svg";
import Power from "@/public/icons/power.svg";
import Telegram from "@/public/icons/telegram_logo.svg";
import Copy from "@/public/icons/copy.svg";
import Wallet from "@/public/icons/wallet.svg";
import { MypageModal } from "@/layout/home/MypageModal";
import Slider from "./Slider";
import BottomSheet from "../home/BottomSheet/BottomSheet";

const Header: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { address, chainId, isConnected } = useAccount();
  const [disconnectToggle, setDisconnectToggle] = useState(false);

  const [curMintValue, setCurMintValue] = useState("");
  const [curMintTic, setCurMintTic] = useState("");
  const [curMintUser, setCurMintUser] = useState("");
  const [curMintCid, setCurMintCid] = useState("");
  const [curCreateTic, setCurCreateTic] = useState("");
  const [curCreateUser, setCurCreateUser] = useState("");
  const [curCreateTime, setCurCreateTime] = useState("");
  const [curCreateCid, setCurCreateCid] = useState("");
  const [curCreateTokenAddress, setCurCreateTokenAddress] = useState("");
  const [curMintTokenAddress, setCurMintTokenAddress] = useState("");
  const [accountButtonModal, setAccountButtonModal] = useState(false);

  const [mintAnimationTrigger, setMintAnimationTrigger] = useState(false);
  const [createAnimationTrigger, setCreateAnimationTrigger] = useState(false);
  const [isWrongChain, setIsWrongChain] = useState(false);

  const [isInfoModalActive, setIsInfoModalActive] = useState(false);
  const [curReserveMarketPrice, setCurReserveMarketPrice] = useState(0.5423);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  useEffect(() => {
    localStorage.setItem("isFetching", "false");
    localStorage.setItem("isFetchingCreate", "false");
  }, []);

  const modalRef = useRef<HTMLDivElement>(null);
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
        // console.log("chainId from changed" + chainId);
        setIsWrongChain(true);
      } else {
        setIsWrongChain(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [chainId]);

  // GNB data update
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${SERVER_ENDPOINT}/tokens/latest`)
        .then((response) => response.json())
        .then((data) => {
          const newCreateTic = data.latestCreatedToken.ticker?.substring(0, 5);
          const newCreateUser = data.latestCreatedToken.creator?.substring(
            0,
            5,
          );
          const newCreateCid = data.latestCreatedToken.cid;
          const newCreateTokenAddress = data.latestCreatedToken.tokenAddress;
          const date = new Date(data.latestCreatedToken.createdAt);
          const formattedDate = `${String(date.getMonth() + 1).padStart(
            2,
            "0",
          )}/${String(date.getDate()).padStart(
            2,
            "0",
          )}/${String(date.getFullYear()).slice(-2)}`;
          const newMintTic = data.latestMintedToken.ticker?.substring(0, 5);
          const newMintUser = data.latestMintedToken.user?.substring(0, 5);
          const newMintCid = data.latestMintedToken.cid;
          const newMintValue = Number(
            ethers.formatEther(data.latestMintedToken.reserveAmount),
          )
            .toFixed(4)
            .toString();
          const newMintTokenAddress = data.latestMintedToken.tokenAddress;
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
        })
        .catch((error) => {
          console.error(error);
        });
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

  useEffect(() => {
    setReserveMarketPriceIntoState();
  }, []);

  const setReserveMarketPriceIntoState = async () => {
    try {
      const response = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${RESERVE_SYMBOL}USDT`,
      );
      // console.log("Reserve PRICE" + response.data.price);
      setCurReserveMarketPrice(response.data.price);
    } catch (error) {
      console.log(error);
    }
  };

  // const MintEventCard: FC<EventCardTypes> = ({ user, value, ticker }) => {
  //   return (
  //     <EventWrapper>
  //       {/* // <EventWrapper $itemN={index}> */}
  //       <div className="flex h-[18px] w-full gap-[3px] ">
  //         {/* TODO: 유저 프로필 이미지 하드코딩중. 추후 해당 유저 프로필로 변경 필요 */}
  //         <Image
  //           width={18}
  //           height={18}
  //           className="rounded-full "
  //           src="/images/Seiyan.png"
  //           alt="user profile"
  //         />
  //         <h1 className="text-sm">{user} bought </h1>
  //       </div>
  //       <div className="flex h-[18px] w-full justify-end gap-[3px]">
  //         <h1 className="text-sm">
  //           {" "}
  //           {value} {RESERVE_SYMBOL} of {ticker}
  //         </h1>
  //         <Image
  //           width={18}
  //           height={18}
  //           className="rounded-full "
  //           src="/images/Seiyan.png"
  //           alt="user profile"
  //         />
  //       </div>
  //     </EventWrapper>
  //   );
  // };

  // const CreateEventCard: FC<EventCardTypes> = ({
  //   index,
  //   user,
  //   ticker,
  //   time,
  // }) => {
  //   return (
  //     <EventWrapper $itemN={index}>
  //       <div className="flex h-[18px] w-full gap-[3px] ">
  //         {/* TODO: 유저 프로필 이미지 하드코딩중. 추후 해당 유저 프로필로 변경 필요 */}
  //         <Image
  //           width={18}
  //           height={18}
  //           className="rounded-full "
  //           src="/images/Seiyan.png"
  //           alt="user profile"
  //         />
  //         <h1 className="text-sm">{user} created </h1>
  //       </div>
  //       <div className="flex h-[18px] w-full justify-end gap-[3px]">
  //         <h1 className="text-sm">
  //           {ticker} on {time}
  //         </h1>
  //         <Image
  //           width={18}
  //           height={18}
  //           className="rounded-full "
  //           src="/images/Seiyan.png"
  //           alt="user profile"
  //         />
  //       </div>
  //     </EventWrapper>
  //   );
  // };

  // const setModalVisible = () => {
  //   if (!window.localStorage.getItem(MODAL_VISIBLE_STORAGE_KEY)) {
  //     setIsInfoModalActive(true);
  //     window.localStorage.setItem(MODAL_VISIBLE_STORAGE_KEY, "false");
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
        <div className="absolute left-1/2 top-1/2 flex h-[206px] w-[535px] -translate-x-1/2 -translate-y-1/2 transform flex-col justify-between rounded-[10px] border bg-stone-900 px-10 py-[25px] text-center text-white">
          <div className="]">
            <h1 className="mb-[20px] text-2xl">Oops..wrong network 😞</h1>
            <h1>It seems you changed to wrong network..</h1>
          </div>

          <div
            onClick={openChainModal}
            className=" cursor-pointer rounded-[10px] border py-[15px] text-center text-xl"
          >
            Change Network to {RESERVE_SYMBOL}
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
            <div className="mb-[34px] h-[111px] gap-[20px]">
              <h1 className="mb-[20px] text-2xl">How it works</h1>
              <h1>
                RWE prevents rugs by making sure that all created tokens are
                safe. Each coin on RWE is a fair-launch with no presale and no
                team allocation.
              </h1>
            </div>

            <div className="h-[335px] gap-[20px]">
              <h1 className="mb-[20px]">step 1 : pick a coin that you like</h1>
              <h1 className="mb-[20px]">
                step 2 : buy the coin on the bonding curve
              </h1>
              <h1 className="mb-[20px]">
                step 3 : sell at any time to lock in your profits or losses
              </h1>
              <h1 className="mb-[20px]">
                step 4 : when enough people buy on the bonding curve it reaches
                a market cap of $
                {Math.floor((60660 * curReserveMarketPrice) / 1000)}k
              </h1>
              <h1 className="mb-[20px]">
                step 5 : ${Math.floor((9000 * curReserveMarketPrice) / 1000)}k
                of liquidity is then deposited in dragonswap and burned
              </h1>
              <h1 className="">
                step 6 : Please make sure to include your telegram address so
                that you can receive the raffle prize.
              </h1>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsInfoModalActive(!isInfoModalActive);
              }}
              className="h-[53px] w-full rounded-[10px] border hover:border-[#FAFF00] hover:text-[#FAFF00]"
            >
              Let&apos;s start
            </button>
          </ModalContentBox>
        </ModalRootWrapper>
      )}
      <header className="sticky left-0 top-0 z-[50] flex h-14 w-screen bg-[#0E0E0E] md:h-[80px]">
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

        <div className="flex h-full w-full items-center justify-between px-2 md:px-7">
          <div className="flex h-[40px] w-full items-center justify-between px-5 text-white">
            <div className="flex h-full items-center justify-evenly gap-4 md:w-[300px] md:gap-[30px]">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-full md:h-[40px] md:gap-[15px] "
              >
                <img
                  src="/icons/logo_icon.svg"
                  alt=""
                  className="h-6 w-6 md:h-[40px] md:w-[40px]"
                />
                <img
                  src="/icons/RWE.svg"
                  alt=""
                  className="h-6 w-20 md:h-[30px] md:w-[86px]"
                />
              </Link>

              <div className="flex gap-3 md:gap-[30px]">
                <Telegram
                  // fill={isHoveredTG ? "#5E5E5E" : "white"}
                  className="h-4 w-4 cursor-pointer fill-[#5E5E5E] hover:fill-white"
                  onClick={() => handleUrlClick("https://t.me/rwe_bet")}
                />
                <X
                  className="cursor-pointer fill-[#5E5E5E] hover:fill-white"
                  onClick={() => handleUrlClick("https://twitter.com/rwe_bet")}
                />
                <Info
                  className="cursor-pointer fill-[#5E5E5E] hover:fill-white"
                  onClick={() => setIsInfoModalActive(!isInfoModalActive)}
                />
              </div>
            </div>
            <div className="hidden h-[40px] items-center gap-[20px] md:flex">
              {curMintUser && (
                <MintAnimateWrapper
                  className={`flex h-full items-center justify-center gap-[5px] rounded-[10px] border border-[#FA00FF] px-[7px] text-[#FA00FF] ${mintAnimationTrigger && "animate"}`}
                >
                  <img
                    src="/images/memesinoGhost.png"
                    alt=""
                    className="h-4 w-4 rounded-full"
                  />

                  <h1 className="whitespace-nowrap text-sm">
                    {curMintUser} bought {curMintValue} ETH of
                  </h1>
                  <Link href={curMintTokenAddress ? curMintTokenAddress : ""}>
                    <h1 className="cursor-pointer text-sm hover:underline">
                      {curMintTic}
                    </h1>
                  </Link>
                  <img
                    src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curMintCid}`}
                    alt="img"
                    className="h-4 w-4 rounded-full"
                  />
                </MintAnimateWrapper>
              )}
              {curCreateUser && (
                <CreateAnimateWrapper
                  className={`flex h-full items-center justify-center gap-[5px] rounded-[10px] border border-[#09FFD3] px-[7px] text-[#09FFD3] ${createAnimationTrigger && "animate"}`}
                >
                  <img
                    src="/images/memesinoGhost.png"
                    alt=""
                    className="h-4 w-4 rounded-full"
                  />
                  <div className="whitespace-nowrap text-sm">
                    {curCreateUser} Created
                  </div>
                  <Link
                    href={curCreateTokenAddress ? curCreateTokenAddress : ""}
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
                    className="h-4 w-4 rounded-full"
                  />
                </CreateAnimateWrapper>
              )}
            </div>
            <div
              className="relative flex select-none flex-row-reverse items-center md:w-[300px]"
              ref={modalRef}
            >
              {address ? (
                <>
                  <div className="hidden h-10 w-52 items-center justify-between rounded-lg border bg-[#252525] px-5 text-sm font-bold text-white md:flex">
                    <div
                      onClick={() => copyToClipboard(address)}
                      className={`flex cursor-pointer items-center gap-2 stroke-transparent hover:stroke-[#6B6B6B] hover:text-[#6B6B6B] active:stroke-black active:text-black`}
                    >
                      <Image
                        src="/images/memesinoGhost.png"
                        alt=""
                        height={16}
                        width={18}
                        className="h-[16px] w-[18px]"
                      />
                      <div
                        className={`absolute duration-1000 ${disconnectToggle ? "w-[120px]" : "w-0"} right-10 flex h-6 items-center justify-center overflow-hidden rounded-full bg-[#686868] text-[15px] text-white hover:text-[#9b9b9b]`}
                        onClick={openAccountModal}
                      >
                        {disconnectToggle && "Disconnect"}
                        <Power className={`ml-1 stroke-white`} />
                      </div>
                      {disconnectToggle || address?.substring(0, 6) + "..."}
                      {disconnectToggle || <Copy />}
                    </div>
                    <div className="flex gap-2">
                      <Power
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        className={`h-[18px] w-[18px] cursor-pointer stroke-[#6B6B6B] hover:stroke-white`}
                        onClick={() => setDisconnectToggle(true)}
                      />
                      <DownArrow
                        onClick={() =>
                          setAccountButtonModal(!accountButtonModal)
                        }
                        width={18}
                        height={18}
                        viewBox="0 0 18 18"
                        className={`h-[18px] w-[18px] transform ${accountButtonModal && "rotate-180"} cursor-pointer hover:stroke-white`}
                      />
                    </div>
                  </div>
                  <div
                    className="h-6 w-6 cursor-pointer rounded-full border border-white bg-slate-400 md:hidden"
                    onClick={() => setAccountButtonModal(!accountButtonModal)}
                  />
                </>
              ) : (
                <>
                  <button
                    onClick={openConnectModal}
                    className="hidden h-[40px] w-[180px] cursor-pointer rounded-[10px] border bg-[#252525] text-[12px] text-white md:block"
                  >
                    Connect Wallet
                  </button>
                  <Wallet
                    className="cursor-pointer md:hidden"
                    onClick={openConnectModal}
                  />
                </>
              )}
              {/* {accountButtonModal && (
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
              )} */}
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
      {/* {accountButtonModal && (
        <MypageModal
          {...{
            setModal: setAccountButtonModal,
          }}
        />
      )} */}

      {accountButtonModal &&
        (isMobile ? (
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
              }}
            />
          </BottomSheet>
        ) : (
          <ModalRootWrapper onClick={ModalOff}>
            <MypageModal
              {...{
                setModal: setAccountButtonModal,
              }}
            />
          </ModalRootWrapper>
        ))}
      <div className="mt-2.5 flex h-12 items-center gap-[20px] md:hidden">
        <Slider
          elements={[
            curMintCid && (
              <MintAnimateWrapper
                key={1}
                className={`flex h-10 items-center justify-center gap-[5px] rounded-[10px] border border-[#FA00FF] px-[7px] text-[#FA00FF] ${mintAnimationTrigger && "animate"} mr-2.5 shadow-md`}
              >
                <img
                  src="/images/memesinoGhost.png"
                  alt=""
                  className="h-[18px] w-[18px] rounded-full"
                />
                <h1 className="text-sm">
                  {curMintUser} bought {curMintValue} ETH of
                </h1>
                <Link href={curMintTokenAddress ? curMintTokenAddress : ""}>
                  <h1 className="cursor-pointer text-sm hover:underline">
                    {curMintTic}
                  </h1>
                </Link>
                <div className="h-[18px] w-[18px] overflow-hidden rounded-full">
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
                className={`flex h-10 items-center justify-center gap-[5px] rounded-[10px] border border-[#09FFD3] px-[7px] text-[#09FFD3] ${createAnimationTrigger && "animate"} mr-2.5`}
              >
                <img
                  src="/images/memesinoGhost.png"
                  alt=""
                  className="h-[18px] w-[18px] rounded-full"
                />
                <h1 className="text-sm">{curCreateUser} Created</h1>
                <Link href={curCreateTokenAddress ? curCreateTokenAddress : ""}>
                  <h1 className="cursor-pointer text-sm hover:underline">
                    {curCreateTic}
                  </h1>
                </Link>

                <h1 className="text-sm">on {curCreateTime}</h1>
                <div className="h-[18px] w-[18px] overflow-hidden rounded-full">
                  <img
                    src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${curCreateCid}`}
                    alt="img"
                  />
                </div>
              </CreateAnimateWrapper>
            ),
          ]}
        />
      </div>
    </>
  );
};

export default Header;

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

const MintAnimateWrapper = styled.div`
  background: #0e0e0e;
  box-shadow: 0px 0px 8px 0px #fa00ff;
  color: #fa00ff;

  &.animate {
    animation:
      ${shake} 250ms 0s 3,
      ${colorReversePink} 1s 0s;
  }
`;

const CreateAnimateWrapper = styled.div`
  box-shadow: 0px 0px 8px 0px #09ffd3;
  color: #09ffd3;

  &.animate {
    animation: ${colorReverseMint} 1s 0s;
  }
`;
