"use client";

import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import { walletAddress } from "@/atoms/atoms";
import contracts from "@/contracts/contracts";
import {
  ConnectButton,
  useAccountModal,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ModalContentBox, ModalRootWrapper } from "@/components/Common/Modal";

import styled, { keyframes } from "styled-components";
import { useAccount, useSwitchChain } from "wagmi";
import { useChainId } from "wagmi";

const Header: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { isConnected, address } = useAccount();
  const pathname = usePathname();
  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();
  const [curMintValue, setCurMintValue] = useState("0.1043");
  const [curMintTic, setCurMintTic] = useState("MEME");
  const [curMintUser, setCurMintUser] = useState("user");
  const [curMintTime, setCurMintTime] = useState("Date");
  const [curCreateTic, setCurCreateTic] = useState("MEME");
  const [curCreateUser, setCurCreateUser] = useState("0x7A2");
  const [curCreateTime, setCurCreateTime] = useState("Date");
  const [accountButtonModal, setAccountButtonModal] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);
  const [createDatas, setCreateDatas] = useState<any[]>([]);

  // Initialize ethers with a provider
  const { ethers } = require("ethers");

  // Load the ABI from the specified file
  const contractABI = abi;

  // Contract address
  const contractAddress = contracts.MCV2_Bond;

  // Initialize ethers with a provider
  const provider = new ethers.JsonRpcProvider(
    "https://evm-rpc-arctic-1.sei-apis.com",
  );

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractABI, provider);

  const MODAL_VISIBLE_STORAGE_KEY = "isFirstVisitToMemesino";

  // Function to fetch and display events in batches
  const ether = (weiValue: bigint, decimals = 18): number => {
    const factor = BigInt(10) ** BigInt(decimals);
    const etherValue = Number(weiValue) / Number(factor);
    return Math.ceil(etherValue * 1000) / 1000;
  };
  // MARK: - Create Events
  async function fetchCreateEventsInBatches(fromBlock: any, batchSize: any) {
    let currentBlock = await provider.getBlockNumber();
    let toBlock = fromBlock + batchSize - 1; // Adjust to ensure the batch size is as specified

    const isFetchingCreate = localStorage.getItem("isFetchingCreate");
    if (isFetchingCreate === "true") {
      console.log(
        "FetchingCreate is already in progress. Aborting this instance.",
      );
      return;
    }

    // Set the fetchingCreate flag to true
    localStorage.setItem("isFetchingCreate", "true");

    try {
      while (fromBlock <= currentBlock) {
        // console.log(
        //   `FetchingCreate events from block ${fromBlock} to ${toBlock}`,
        // );

        // Adjust toBlock for the last batch if it exceeds currentBlock
        if (toBlock > currentBlock) {
          toBlock = currentBlock;
        }

        let events;
        try {
          events = await contract.queryFilter(
            contract.filters.TokenCreated(),
            fromBlock,
            toBlock,
          );
        } catch (error) {
          console.error("Error fetching events:", error);
          break; // Exit the loop if there's an error fetching events
        }

        let newDatas;
        try {
          newDatas = await Promise.all(
            events
              .slice(0)
              .reverse()
              .map(async (event: any) => {
                const block = await provider.getBlock(event.blockNumber);
                const timestamp = block.timestamp;
                const date = new Date(timestamp * 1000);

                // Format the date as DD/MM/YY
                const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

                // Log the event details along with the block timestamp
                console.log(
                  `Token Created: ${event.args.name} (${event.args.symbol}), Token Address: ${event.args.token}, Reserve Token: ${event.args.reserveToken} Block Timestamp: ${date}`,
                );
                setCurCreateTic(event.args.symbol.substring(0, 5));
                setCurCreateUser(event.args.token.substring(0, 5)); // Fake value!
                setCurCreateTime(formattedDate);

                return {
                  tic: event.args.symbol.substring(0, 5),
                  user: event.args.token.substring(0, 5), // Fake value!
                  time: formattedDate,
                };
              }),
          );
        } catch (error) {
          console.error("Error processing events:", error);
          break; // Exit the loop if there's an error processing events
        }

        setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

        // Prepare for the next batch
        fromBlock = toBlock + 1;
        toBlock = fromBlock + batchSize - 1;

        // Small delay to prevent rate limiting (optional, adjust as necessary)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      localStorage.setItem("isFetchingCreate", "false");
    }
  }

  // MARK: - Mint Events
  async function fetchMintEventsInBatches(fromBlock: any, batchSize: any) {
    let currentBlock = await provider.getBlockNumber();
    let toBlock = fromBlock + batchSize - 1; // Adjust to ensure the batch size is as specified

    const isFetching = localStorage.getItem("isFetching");
    if (isFetching === "true") {
      console.log("Fetching is already in progress. Aborting this instance.");
      return;
    }

    // Set the fetching flag to true
    localStorage.setItem("isFetching", "true");

    while (fromBlock <= currentBlock) {
      // console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);

      // Adjust toBlock for the last batch if it exceeds currentBlock
      if (toBlock > currentBlock) {
        toBlock = currentBlock;
      }

      const events = await contract.queryFilter(
        contract.filters.Mint(),
        fromBlock,
        toBlock,
      );

      const newDatas = await Promise.all(
        events
          .slice(0)
          .reverse()
          .map(async (event: any) => {
            const block = await provider.getBlock(event.blockNumber);
            const timestamp = block.timestamp;
            const date = new Date(timestamp * 1000);

            // Format the date as DD/MM/YY
            const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

            // Log the event details along with the block timestamp
            console.log(
              `Token Minted: ${event.args.token}, Amount: ${event.args.amountMinted}, Buyer: ${event.args.receiver}, Block Timestamp: ${date.toLocaleString()}`,
            );
            setCurMintTic(event.args.token.substring(0, 5));
            setCurMintValue(String(ether(event.args.amountMinted)));
            setCurMintUser(event.args.receiver.substring(0, 5));
            setCurMintTime(formattedDate);

            return {
              val: String(ether(event.args.amountMinted)),
              tic: event.args.token.substring(0, 5),
              user: event.args.receiver.substring(0, 5),
              time: formattedDate,
            };
          }),
      );

      setDatas((prevDatas) => [...newDatas, ...prevDatas]);

      // Prepare for the next batch
      fromBlock = toBlock + 1;
      toBlock = fromBlock + batchSize - 1;

      // Small delay to prevent rate limiting (optional, adjust as necessary)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Reset the fetching flag
    localStorage.setItem("isFetching", "false");
  }
  // usage: Fetch events in batches of 5000 blocks starting from block 19966627
  // usage: Fetch events in batches of 5000 blocks starting from block 19966627

  useEffect(() => {
    fetchMintEventsInBatches(20587998, 5000);
    fetchCreateEventsInBatches(19966627, 5000);
    setModalVisible();
  }, []);

  useEffect(() => {
    localStorage.setItem("isFetching", "false");
    localStorage.setItem("isFetchingCreate", "false");
  }, []);
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    fetch("https://memesino.fun/homeTokenInfo") // Add this block
      .then((response) => response.json())
      .then((data) => setTokenInfo(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (chainId != 713715) {
      switchChain({ chainId: 713715 });
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
        console.log("SEI PRICE" + response.data.price);
        setCurSeiPrice(response.data.price);
      } catch (error) {
        console.log(error);
      }
    };

    getSeiPrice();
  }, []);
  return (
    <>
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
                {/* <ImageTG alt="telegram icon" /> */}

                {/* <ImageX
                  alt="x icon"

                  <Image
                    src="/icons/telegram_logo.svg"
                    alt=""
                    width={50}
                    height={50}
                    className="h-[15px] w-[15px] cursor-pointer"
                     onClick={() =>
                    handleClick("https://t.me/memesinodotfun")
                  }
                /> */}

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

                {/* <ImageInfo alt="info icon" onClick={() =>
                    handleClick("https://t.me/memesinodotfun")
                  } /> */}
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
                {/* <Image
                  src="/icons/info.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px] cursor-pointer"
                  
                /> */}
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
                  />
                </div>

                <h1 className="text-sm">
                  {curMintUser} bought {curMintValue} SEI of
                </h1>
                <h1 className="cursor-pointer text-sm hover:underline">
                  {curMintTic}
                </h1>
                <div className="h-[18px] w-[18px] rounded-full bg-[#FA00FF]" />
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
                <h1 className="cursor-pointer text-sm hover:underline">
                  {curCreateTic}
                </h1>
                <h1 className="text-sm">on {curCreateTime}</h1>
                <div className="h-[18px] w-[18px] rounded-full bg-[#09FFD3]" />
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
