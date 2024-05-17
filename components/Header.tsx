"use client";

import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/contracts/contracts";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Header: FC = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const pathname = usePathname();

  const [curMintValue, setCurMintValue] = useState("0.1043");
  const [curMintTic, setCurMintTic] = useState("MEME");
  const [curMintUser, setCurMintUser] = useState("user");
  const [curMintTime, setCurMintTime] = useState("Date");
  const [curCreateTic, setCurCreateTic] = useState("MEME");
  const [curCreateUser, setCurCreateUser] = useState("0x7A2");
  const [curCreateTime, setCurCreateTime] = useState("Date");
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

    while (fromBlock <= currentBlock) {
      console.log(
        `FetchingCreate events from block ${fromBlock} to ${toBlock}`,
      );

      // Adjust toBlock for the last batch if it exceeds currentBlock
      if (toBlock > currentBlock) {
        toBlock = currentBlock;
      }

      const events = await contract.queryFilter(
        contract.filters.TokenCreated(),
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

      setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

      // const newDatas = events.map((event: any) => ({
      //   tic: event.args.symbol.substring(0, 5),
      //   user: event.args.token.substring(0, 5),
      // }));

      // setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

      // events.forEach((event: any) => {
      //   console.log(
      //     `Token Created: ${event.args.name} (${event.args.symbol}), Token Address: ${event.args.token}, Reserve Token: ${event.args.reserveToken}`,
      //   );
      //   setCurCreateTic(event.args.symbol.substring(0, 5));
      //   setCurCreateUser(event.args.token.substring(0, 5)); // Fake value!
      // });

      // Prepare for the next batch
      fromBlock = toBlock + 1;
      toBlock = fromBlock + batchSize - 1;

      // Small delay to prevent rate limiting (optional, adjust as necessary)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    localStorage.setItem("isFetchingCreate", "false");
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
      console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);

      // Adjust toBlock for the last batch if it exceeds currentBlock
      if (toBlock > currentBlock) {
        toBlock = currentBlock;
      }

      const events = await contract.queryFilter(
        contract.filters.Mint(),
        fromBlock,
        toBlock,
      );

      // const newDatas = events.map((event: any) => ({
      //   val: String(ether(event.args.amountMinted)),
      //   tic: event.args.token.substring(0, 5),
      //   user: event.args.receiver.substring(0, 5),
      // }));

      // setDatas((prevDatas) => [newDatas, ...prevDatas]);

      // events.forEach((event: any) => {
      //   console.log(
      //     `Token Minted: ${event.args.token}, Amount: ${event.args.amountMinted}, Buyer: ${event.args.receiver} `,
      //   );
      //   setCurMintTic(event.args.token.substring(0, 5));
      //   setCurMintValue(String(ether(event.args.amountMinted)));
      //   setCurMintUser(event.args.receiver.substring(0, 5));
      // });

      // for (const event of events) {
      //   const block = await provider.getBlock(event.blockNumber);
      //   const timestamp = block.timestamp;
      //   // Convert timestamp to a readable date format, if necessary
      //   const date = new Date(timestamp * 1000).toLocaleString();

      //   // Log the event details along with the block timestamp
      //   console.log(
      //     `Token Minted: ${event.args.token}, Amount: ${event.args.amountMinted}, Buyer: ${event.args.receiver}, Block Timestamp: ${date}`,
      //   );
      //   setCurMintTic(event.args.token.substring(0, 5));
      //   setCurMintValue(String(ether(event.args.amountMinted)));
      //   setCurMintUser(event.args.receiver.substring(0, 5));
      //   setCurMintTime(date);
      // }

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
  }, []);

  useEffect(() => {
    localStorage.setItem("isFetching", "false");
    localStorage.setItem("isFetchingCreate", "false");
  }, []);

  const MintEventCard: FC<EventCardTypes> = ({ user, value, ticker }) => {
    return (
      <div className="mb-[20px] h-[55px] w-[182px] rounded-[8px] bg-white px-[15px] py-[8px]">
        <div className="flex h-[18px] w-full gap-[3px] ">
          <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
          <h1 className="text-sm">{user} bought </h1>
        </div>
        <div className="flex h-[18px] w-full justify-end gap-[3px]">
          <h1 className="text-sm">
            {" "}
            {value} SEI of {ticker}
          </h1>
          <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
        </div>
      </div>
    );
  };

  const CreateEventCard: FC<EventCardTypes> = ({ user, ticker, time }) => {
    return (
      <div className="mb-[20px] h-[55px] w-[182px] rounded-[8px] bg-white px-[15px] py-[8px]">
        <div className="flex h-[18px] w-full gap-[3px] ">
          <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
          <h1 className="text-sm">{user} created </h1>
        </div>
        <div className="flex h-[18px] w-full justify-end gap-[3px]">
          <h1 className="text-sm">
            {ticker} on {time}
          </h1>
          <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky left-0 top-0 z-[9999] flex h-[80px] w-screen bg-[#1F1F1F]">
        {pathname == "/" && (
          <div className="absolute left-0 top-[130px] flex h-[80vh] w-[15vw] justify-center gap-[40px]  ">
            <div className="h-full overflow-hidden">
              {datas.map((card: any, index: any) => (
                <MintEventCard
                  key={index}
                  value={card.val}
                  ticker={card.tic}
                  user={card.user}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex h-full w-full items-center justify-between px-[30px]">
          <div className="flex h-[40px] w-full items-center justify-between px-2 text-white">
            <div className="flex h-full items-center justify-evenly gap-[30px]">
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
                  src="/icons/telegram_logo.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px]"
                />

                <Image
                  src="/icons/X_logo.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px]"
                />

                <Image
                  src="/icons/info.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="h-[15px] w-[15px]"
                />
              </div>
            </div>
            <div className="flex h-full items-center gap-[20px]">
              <div className="flex h-full w-[400px] items-center justify-center gap-[5px] rounded-[10px] border border-[#F900FF] text-[#F900FF]">
                <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
                <h1 className="">
                  {curMintUser} bought {curMintValue} SEI of {curMintTic}
                </h1>
                <div className="h-[18px] w-[18px] rounded-full bg-[#F900FF]" />
              </div>
              <div className="flex h-full w-[400px] items-center justify-center gap-[5px] rounded-[10px] border border-[#09FFD2] text-[#09FFD2]">
                <div className="h-[18px] w-[18px] rounded-full bg-[#09FFD2]" />
                <h1>
                  {curCreateUser} Created {curCreateTic} on {curCreateTime}
                </h1>
                <div className="h-[18px] w-[18px] rounded-full bg-[#09FFD2]" />
              </div>
            </div>
            <div className="flex items-center">
              {/* <ConnectButton /> */}
              {isConnected ? (
                <button
                  onClick={openAccountModal}
                  className="flex h-[45px] w-[180px]
                  cursor-pointer
                  items-center justify-center gap-[9px] rounded-[13.5px] border text-[15px] font-bold  text-white"
                >
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
                  className="h-[45px] w-[180px] cursor-pointer rounded-[13.5px] border text-white"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
        {pathname == "/" && (
          <div className="absolute right-0 top-[130px] flex h-[80vh] w-[15vw] justify-center ">
            <div className="h-full overflow-hidden">
              {createDatas.map((card: any, index: any) => (
                <CreateEventCard
                  key={index}
                  time={card.time}
                  ticker={card.tic}
                  user={card.user}
                />
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
