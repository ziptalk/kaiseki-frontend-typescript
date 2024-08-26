"use client";
import { FC, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useAccount } from "wagmi";
import Image from "next/image";

import { digital } from "@/fonts/font";
import { useEthersSigner } from "@/utils/ethersSigner";
import { stepPrices, stepRanges } from "@/global/createValue";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";

import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";

const Create: NextPage = () => {
  const signer = useEthersSigner();
  const account = useAccount();
  const router = useRouter();

  // MARK: - ethers init
  const provider = new ethers.JsonRpcProvider(process.env.RPC_SEPOLIA);
  const { abi: MCV2_BondABI } = MCV2_BondArtifact;
  const errorDecoder = ErrorDecoder.create([MCV2_BondABI]);
  const bondWriteContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    signer,
  );
  const bondReadContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    provider,
  );

  // TODO - Change creation fee later
  // const creationFeeInWei = ethers.parseEther("3.5");
  const creationFeeInWei = ethers.parseEther("0.0015");
  const inputFile = useRef(null);

  const [cid, setCid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tickers, setTickers] = useState([]);

  const [isMoreOptionsToggled, setIsMoreOptionsToggled] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputTicker, setInputTicker] = useState("");
  const [inputDesc, setInputDesc] = useState("");
  const [inputXURL, setInputXURL] = useState("");
  const [inputTGURL, setInputTGURL] = useState("");
  const [inputWebURL, setInputWebURL] = useState("");

  // Get data from server for check dup
  useEffect(() => {
    fetch(`${SERVER_ENDPOINT}/homeTokenInfo`)
      .then((response) => response.json())
      .then((data) => {
        // ticker 값만 추출하여 새로운 배열 생성
        const tickerValues = data.map((item: any) => item.ticker);
        setTickers(tickerValues);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // MARK: - Upload to Server
  const sendCidAndTokenAddressToServer = async (
    createdTokenAddress: any,
    cid: any,
  ) => {
    try {
      const response = await fetch(
        `${SERVER_ENDPOINT}/storeCidAndTokenAddress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cid,
            name: inputName,
            ticker: inputTicker,
            tokenAddress: createdTokenAddress,
            description: inputDesc,
            twitterUrl: inputXURL,
            telegramUrl: inputTGURL,
            websiteUrl: inputWebURL,
            marketCap: 0,
            createdBy: account.address,
            timestamp: new Date().toISOString(),
          }),
        },
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFileToPinata = async (fileToUpload: File) => {
    try {
      setIsLoading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/pinata", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCid(resData.IpfsHash);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      alert("Trouble uploading file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileToPinata(e.target.files[0]);
    }
  };

  // MARK: - Validation
  const getUserReserveBalance = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }
      if (account.address) {
        const balanceWei = await provider.getBalance(account.address);
        console.log(balanceWei);
        const balanceEther = ethers.formatEther(balanceWei);
        console.log(balanceEther);
        return balanceEther;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isUserGotMoreThanCreationFee = async () => {
    const value = await getUserReserveBalance();
    if (parseFloat(value!) >= 3.5) {
      return false;
    } else {
      return true;
    }
  };

  const isInvalidInput = async (
    name: string,
    ticker: string,
  ): Promise<boolean> => {
    const matchingTicker = tickers.find((t) => t === ticker);

    if (account.status === "disconnected") {
      alert("Connect your wallet first!");
      return true;
    }
    // TODO - Make this able later
    // if (await isUserGotMoreThanCreationFee()) {
    //   alert(`You must have at least 3.5 ${RESERVE_SYMBOL} to create a token.`);
    //   return true;
    // }
    if (matchingTicker) {
      alert("Ticker already exists!");
      return true;
    }
    if (!name || !ticker) {
      alert("Invalid input value!");
      return true;
    }
    if (name.length > 30) {
      alert("Invalid name length!");
      return true;
    }
    if (ticker.length > 10) {
      alert("Invalid Ticker length!");
      return true;
    }
    if (inputDesc.length > 100) {
      alert("Invalid description length!");
      return true;
    }
    if (!cid) {
      alert("Invalid input value!");
      return true;
    }
    if (isLoading) {
      return true;
    }

    return false;
  };

  const fetchTokenAddressFromEvent = async () => {
    try {
      const filter = bondReadContract.filters.TokenCreated();
      const events = await bondReadContract.queryFilter(filter, -1000);

      if (events.length > 0) {
        for (const log of events) {
          const event = bondReadContract.interface.decodeEventLog(
            "TokenCreated",
            log.data,
            log.topics,
          );
          if (event[1] === inputName) {
            console.log("event :" + event[0]);
            return event[0];
          }
        }
      } else {
        console.log("No events found");
      }
    } catch (error) {
      console.error("Error querying filter:", error);
    }
  };

  // MARK: - Create token
  const createToken = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name") as string;
      const ticker = formData.get("ticker") as string;

      if (await isInvalidInput(name, ticker)) return;

      setIsLoading(true);
      const receipt = await bondWriteContract.createToken(
        { name: name, symbol: ticker },
        {
          mintRoyalty: 100,
          burnRoyalty: 100,
          reserveToken: contracts.ReserveToken,
          maxSupply: ethers.parseEther("800000000"),
          stepRanges: stepRanges,
          stepPrices: stepPrices,
        },
        {
          value: creationFeeInWei.toString(),
        },
      );
      await receipt.wait();
      console.log("Transaction receipt :" + receipt);

      const createdTokenAddress = await fetchTokenAddressFromEvent();

      await sendCidAndTokenAddressToServer(createdTokenAddress, cid);
      setIsLoading(false);

      routeToDetailPageAfterMint(createdTokenAddress);
    } catch (error) {
      const decodedError = await errorDecoder.decode(error);
      console.log("Custom error reason:", decodedError);
      console.error("Error while minting:", error);
      setIsLoading(false);
    }
  };

  const routeToDetailPageAfterMint = async (createdTokenAddress: string) => {
    // await getNextMintPrice(createdTokenAddress);
    // setIsModalVisible(true);
    router.push(`/${createdTokenAddress}`);
  };

  const PreviewTokenCard: FC = () => {
    return (
      <div className="">
        <Image
          src="/images/Preview.svg"
          alt=""
          width={500}
          height={500}
          className="mx-auto h-full w-1/4"
        />
        <div className="flex h-[185px] w-full justify-between gap-[10px] border border-dashed border-[#F9FF00] p-[10px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]">
          <div>
            {cid ? (
              <div className="h-[120px] w-[120px]">
                <img
                  src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                  alt="Image from IPFS"
                />
              </div>
            ) : (
              <div className="h-[120px] w-[120px] bg-[#D9D9D9]"></div>
            )}
          </div>
          <div className=" text w-[334px] overflow-hidden px-[10px]">
            <div className="">
              <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                {inputName ? inputName : "Name"}
              </h1>
              <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                [ticker: {inputTicker ? inputTicker : "ticker"}]
              </h1>
            </div>

            <div className="flex items-center gap-[5px]">
              <h1 className="neon-lime text-xs text-[#C5F900] ">Created by:</h1>
              <Image
                className="rounded-full"
                src="/images/memesinoGhost.png"
                alt=""
                width={12}
                height={12}
                style={{ width: 12, height: 12 }}
              />
              <h1 className="neon-lime text-xs text-[#C5F900] ">
                {account.address?.substring(0, 6)}
              </h1>
            </div>

            <div className="flex">
              <h1 className="neon-yellow text-xs text-[#FAFF00]">
                Market cap:&nbsp;
              </h1>
              <h1
                className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
              >
                0.00K
              </h1>
            </div>

            <h1 className="h-[90px] text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
              {inputDesc
                ? inputDesc
                : "Pizza ipsum dolor meat lovers buffalo. Bacon Aussie mozzarella buffalo hand lovers string. Chicago garlic roll banana mayo tomatoes banana pineapple marinara sauce. Thin anchovies deep banana lasagna style ranch pesto string. Onions crust fresh mayo dolor fresh onions pizza buffalo."}
            </h1>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-screen bg-[#0E0E0E]">
        <div className="mx-auto h-full w-[500px] pt-[30px]">
          <PreviewTokenCard />
          <form onSubmit={createToken}>
            <h1 className="mt-[30px] pb-[7px] text-[16px] font-normal text-white">
              name
            </h1>
            <input
              name="name"
              type="text"
              placeholder="name (up to 30)"
              value={inputName}
              onChange={(e: any) => setInputName(e.target.value)}
              className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
            />
            <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
              ticker
            </h1>
            <input
              name="ticker"
              type="text"
              placeholder="ticker (up to 10)"
              value={inputTicker}
              onChange={(e: any) => setInputTicker(e.target.value)}
              className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
            />
            <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
              image
            </h1>
            <input
              ref={inputFile}
              onChange={handleFileChange}
              name="image"
              type="file"
              accept="image/*"
              className=" flex h-[50px] w-full items-center rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
            />
            <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
              description
            </h1>
            <textarea
              value={inputDesc}
              onChange={(e: any) => setInputDesc(e.target.value)}
              name="description"
              placeholder="description (up to 100)"
              className="h-[120px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
            />
            <div
              onClick={() => setIsMoreOptionsToggled(!isMoreOptionsToggled)}
              className="mt-[18px] flex cursor-pointer text-[#FF2626]"
            >
              <h1>more options&nbsp;</h1>
              <h1 className="text-white">{isMoreOptionsToggled ? "-" : "+"}</h1>
            </div>
            {isMoreOptionsToggled && (
              <>
                <h1 className="mt-[20px] pb-[7px] text-[16px] font-normal text-white">
                  twitter link
                </h1>
                <input
                  value={inputXURL}
                  onChange={(e: any) => setInputXURL(e.target.value)}
                  name="X URL"
                  type="text"
                  placeholder="(optional)"
                  className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                />
                <h1 className="mt-[19px] pb-[7px]  text-[16px] font-normal text-white">
                  telegram link
                </h1>
                <input
                  value={inputTGURL}
                  onChange={(e: any) => setInputTGURL(e.target.value)}
                  name="Telegram URL"
                  type="text"
                  placeholder="(optional)"
                  className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                />
                <h1 className="mt-[19px] pb-[7px] text-[16px] font-normal text-white">
                  website link
                </h1>
                <input
                  value={inputWebURL}
                  onChange={(e: any) => setInputWebURL(e.target.value)}
                  name="Website URL"
                  type="text"
                  placeholder="(optional)"
                  className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                />
              </>
            )}
            <button
              type="submit"
              className={`mt-[34px] flex h-[60px] w-full items-center justify-center rounded-[8px] font-['Impact'] text-[16px] font-light tracking-wider text-white ${isLoading ? "bg-[#900000]" : "bg-gradient-to-b from-[#FF0000] to-[#900000] shadow-[0_0px_20px_rgba(255,38,38,0.5)]"} `}
            >
              {isLoading ? (
                <Image
                  src="/icons/Loading.svg"
                  alt="loading Icon"
                  height={24}
                  width={24}
                  className="animate-spin"
                />
              ) : (
                <h1>Create Token</h1>
              )}
            </button>
          </form>
          <div className="pb-20" />
        </div>
      </div>
    </>
  );
};

export default Create;
