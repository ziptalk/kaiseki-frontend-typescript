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
import {
  stepPrices,
  stepRanges,
  maxSupply,
  creationFee,
} from "@/global/createValue";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";
import Preview from "@/public/icons/Preview.svg";
import Arrow from "@/public/icons/pagePre.svg";

import { RESERVE_SYMBOL, SERVER_ENDPOINT } from "@/global/projectConfig";
import { Inputform } from "@/components/common/Inputform";
import { Button } from "@/components/atoms/Button";
import { CreateCard } from "@/components/detail/CreateCard";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { StoreCidAndTokenAddress } from "@/utils/apis/apis";
import { wei } from "@/utils/weiAndEther";
import { BILLION } from "@/global/constants";

export interface HookFormTypes {
  Name: string;
  Ticker: string;
  Image: FileList;
  prize: string;
  threshold: string;
  Description: string;
  twitter?: string;
  telegram?: string;
  website?: string;
}

const Create: NextPage = () => {
  const signer = useEthersSigner();
  const account = useAccount();
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<HookFormTypes>({
    defaultValues: {
      Name: "",
      Ticker: "",
      Image: undefined,
      Description: "",
    },
  });

  // MARK: - ethers init
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);
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
  // const creationFeeInWei = ethers.parseEther("0.007");

  const [isLoading, setIsLoading] = useState(false);
  // const [tickers, setTickers] = useState([]);
  const [cid, setCid] = useState("");
  const [isMoreOptionsToggled, setIsMoreOptionsToggled] = useState(false);

  // console.log(creationFee);

  // Get data from server for check dup
  // useEffect(() => {
  //   fetch(`${SERVER_ENDPOINT}/homeTokenInfo`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       // ticker 값만 추출하여 새로운 배열 생성
  //       const tickerValues = data.map((item: any) => item.ticker);
  //       setTickers(tickerValues);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  // MARK: - Upload to Server
  const sendCidAndTokenAddressToServer = async (createdTokenAddress: any) => {
    const response = await StoreCidAndTokenAddress({
      cid,
      tokenAddress: createdTokenAddress,
      description: watch("Description"),
      twitterUrl: watch("twitter") || "",
      telegramUrl: watch("telegram") || "",
      websiteUrl: watch("website") || "",
      name: watch("Name"),
      ticker: watch("Ticker"),
      createdBy: account.address,
      marketCap:
        Number(ethers.formatEther(stepPrices[0].toString())) *
        Number(ethers.formatEther(stepRanges[0].toString())) *
        BILLION,
      threshold: parseInt(watch("threshold")),
      rafflePrize: watch("prize"),
      timestamp: new Date().toISOString(),
    });
    console.log(response);
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

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (Number(e.target.value) !== 0 && Number(e.target.value) < 0.01) {
    //   setValue("threshold", "");
    // } else {
    setValue("threshold", e.target.value);
    // }
  };

  // MARK: - Validation
  const getUserReserveBalance = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }
      if (account.address) {
        const balanceWei = await provider.getBalance(account.address);
        // console.log(balanceWei);
        const balanceEther = ethers.formatEther(balanceWei);
        // console.log(balanceEther);
        return balanceEther;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isUserGotMoreThanCreationFee = async () => {
    const value = await getUserReserveBalance();
    if (parseFloat(value!) >= 0.0015) {
      return false;
    } else {
      return true;
    }
  };

  const isInvalidInput = async (): Promise<boolean> => {
    // const matchingTicker = tickers.find((t) => t === watch("Ticker"));

    if (account.status === "disconnected") {
      alert("Connect your wallet first!");
      return true;
    }
    // TODO - Make this able later
    if (await isUserGotMoreThanCreationFee()) {
      alert(
        `You must have at least ${ethers.formatEther(creationFee)} ${RESERVE_SYMBOL} to create a token.`,
      );
      return true;
    }
    // if (matchingTicker) {
    //   alert("Ticker already exists!");
    //   return true;
    // }
    if (!watch("threshold")) {
      alert("Invalid input value!");
      return true;
    }
    if (parseInt(watch("threshold")) < 0.01) {
      alert("Invalid input value!");
      return true;
    }
    if (!watch("prize")) {
      alert("Invalid input value!");
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
    if (!watch("Image")) {
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
          value: creationFee.toString(),
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
    // href={{
    //   pathname: "/detail",
    //   query: {
    //     cid,
    //     tokenAddress,
    //     name,
    //     ticker,
    //     createdBy,
    //     description,
    //   },
    // }}
    router.push(
      `/detail?cid=${cid}&tokenAddress=${createdTokenAddress}&name=${watch("Name")}&ticker=${watch("Ticker")}&createdBy=${account.address}&description=${watch("Description")}`,
    );
  };

  const onInvalid = async () => {
    if (await isInvalidInput()) return;
  };

  return (
    <div className="relative flex w-screen flex-col items-center gap-6 bg-[#0E0E0E] p-5">
      <div className="mx-auto mt-3 hidden w-full md:block md:w-[1151px]">
        <PageLinkButton href={"/"} prev>
          Back Home
        </PageLinkButton>
      </div>
      <Arrow
        fill="#AEAEAE"
        className="absolute left-7 top-9 md:hidden"
        width={30}
        height={30}
        onClick={() => router.push("/")}
      />
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
        className="flex w-full flex-col items-center gap-3 md:gap-6"
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
            name: "Image",
            register,
            onChange: handleFileChange,
            file: watch("Image"),
            type: "file",
          }}
        />
        <Inputform
          {...{
            viewName: "Raffle Prize",
            maxLength: 50,
            name: "prize",
            register,
            value: watch("prize"),
          }}
        />
        <Inputform
          {...{
            viewName: "Mint Threshold For Raffle and DEX Listing",
            name: "threshold",
            register,
            value: watch("threshold"),
            onChange: handleThresholdChange,
            type: "number",
          }}
        />
        {/* <div
          className={
            "h-13 mt-2 flex w-full items-center justify-between rounded-md border border-[#8F8F8F] bg-[#303030] p-2.5 text-white outline-none"
          }
        >
          <input
            type="number"
            step={0.01}
            placeholder={"The minimum value allowed is 0.01 ETH"}
            className="h-full w-full bg-transparent text-white outline-none"
            {...register("threshold", { onChange: () => {} })}
          />
          <div className="text-sm font-bold">ETH</div>
        </div> */}
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
          className="flex cursor-pointer text-[#FF2626] md:w-[484px]"
        >
          <h1>more options&nbsp;</h1>
          <h1 className="text-white">{isMoreOptionsToggled ? "-" : "+"}</h1>
        </div>
        {isMoreOptionsToggled && (
          <>
            <Inputform
              optional
              {...{
                viewName: "twitter link",
                name: "twitter",
                register,
                value: watch("twitter"),
              }}
            />
            <Inputform
              optional
              {...{
                viewName: "telegram link",
                name: "telegram",
                register,
                value: watch("telegram"),
              }}
            />
            <Inputform
              optional
              {...{
                viewName: "website link",
                name: "website",
                register,
                value: watch("website"),
              }}
            />
          </>
        )}
        <Button className="md:w-[484px]">
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
