"use client";
import { FC, use, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useAccount } from "wagmi";
import Image from "next/image";
import { FieldErrors, set, useForm } from "react-hook-form";

import { digital } from "@/fonts/font";
import { useEthersSigner } from "@/utils/ethersSigner";
import { stepPrices, stepRanges } from "@/global/createValue";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";
import Preview from "@/public/icons/Preview.svg";

import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";
import { Inputform } from "@/components/common/Inputform";
import { Button } from "@/components/atoms/Button";
import { CreateCard } from "@/components/detail/CreateCard";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";

export interface HookFormTypes {
  Name: string;
  Ticker: string;
  File: FileList;
  Description: string;
  "twitter link"?: string;
  "telegram link"?: string;
  "website link"?: string;
}

const Create: NextPage = () => {
  const signer = useEthersSigner();
  const account = useAccount();
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<HookFormTypes>({
    defaultValues: {
      Name: "",
      Ticker: "",
      File: undefined,
      Description: "",
    },
  });
  console.log("🚀 ~ watch:", watch());

  // MARK: - ethers init
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_SEPOLIA,
  );
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
  const creationFeeInWei = ethers.parseEther("0.0007");
  const [isLoading, setIsLoading] = useState(false);
  const [tickers, setTickers] = useState([]);
  const [cid, setCid] = useState("");
  const [isMoreOptionsToggled, setIsMoreOptionsToggled] = useState(false);

  useEffect(() => {
    console.log({ cid });
  }, [cid]);
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
  const sendCidAndTokenAddressToServer = async (createdTokenAddress: any) => {
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
            name: watch("Name"),
            ticker: watch("Ticker"),
            tokenAddress: createdTokenAddress,
            description: watch("Description"),
            twitterUrl: watch("twitter link"),
            telegramUrl: watch("telegram link"),
            websiteUrl: watch("website link"),
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

  const isInvalidInput = async (): Promise<boolean> => {
    const matchingTicker = tickers.find((t) => t === watch("Ticker"));

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
    if (!watch("Name") || !watch("Ticker")) {
      alert("Invalid input value!");
      return true;
    }
    if (watch("Name").length > 30) {
      alert("Invalid name length!");
      return true;
    }
    if (watch("Ticker").length > 10) {
      alert("Invalid Ticker length!");
      return true;
    }
    if (watch("Description").length > 100) {
      alert("Invalid description length!");
      return true;
    }
    if (!watch("File")) {
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
          if (event[1] === watch("Name")) {
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
  const createToken = async (data: HookFormTypes) => {
    try {
      if (await isInvalidInput()) return;

      setIsLoading(true);
      const receipt = await bondWriteContract.createToken(
        { name: data.Name, symbol: data.Ticker },
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

      await sendCidAndTokenAddressToServer(createdTokenAddress);
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

  const onInvalid = async () => {
    if (await isInvalidInput()) return;
  };

  return (
    <div className="flex w-screen flex-col items-center gap-6 bg-[#0E0E0E]">
      <PageLinkButton href="/" prev className="w-1/2">
        Back Home
      </PageLinkButton>
      <Preview />
      <CreateCard
        {...{
          cid,
          name: watch("Name"),
          ticker: watch("Ticker"),
          address: account.address?.substring(0, 6) || "unvalid",
          description: watch("Description"),
        }}
      />
      <form
        onSubmit={handleSubmit(createToken, onInvalid)}
        className="flex flex-col gap-6"
      >
        <Inputform
          {...{
            name: "Name",
            maxLength: 30,
            register,
            value: watch("Name"),
          }}
        />
        <Inputform
          {...{
            name: "Ticker",
            maxLength: 10,
            register,
            value: watch("Ticker"),
          }}
        />
        <Inputform
          {...{
            name: "File",
            register,
            onChange: handleFileChange,
            file: watch("File"),
            type: "file",
          }}
        />
        <Inputform
          {...{
            name: "Description",
            maxLength: 100,
            register,
            value: watch("Description"),
            type: "textarea",
          }}
        />
        <div
          onClick={() => setIsMoreOptionsToggled(!isMoreOptionsToggled)}
          className="flex cursor-pointer text-[#FF2626]"
        >
          <h1>more options&nbsp;</h1>
          <h1 className="text-white">{isMoreOptionsToggled ? "-" : "+"}</h1>
        </div>
        {isMoreOptionsToggled && (
          <>
            <Inputform
              optional
              {...{
                name: "twitter link",
                register,
                value: watch("twitter link"),
              }}
            />
            <Inputform
              optional
              {...{
                name: "telegram link",
                register,
                value: watch("telegram link"),
              }}
            />
            <Inputform
              optional
              {...{
                name: "website link",
                register,
                value: watch("website link"),
              }}
            />
          </>
        )}
        <Button>
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
        </Button>
      </form>
    </div>
  );
};

export default Create;
