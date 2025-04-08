"use client";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { createStep } from "@/global/createValue";

import { impact } from "@/fonts/font";
import { useEthersSigner } from "@/utils/ethersSigner";
import { stepRanges, creationFee } from "@/global/createValue";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import contracts from "@/global/contracts";
import Arrow from "@/public/icons/pagePre.svg";

import { RESERVE_SYMBOL } from "@/global/projectConfig";
import { Inputform } from "@/components/common/Inputform";
import { Button } from "@/components/atoms/Button";
import { CreateCard } from "@/components/detail/CreateCard";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { StoreCidAndTokenAddress } from "@/utils/apis/apis";
import { BILLION } from "@/global/constants";

export interface HookFormTypes {
  Name: string;
  Ticker: string;
  telegramId: string;
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
      telegramId: "@",
      prize: "",
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

  const [isLoading, setIsLoading] = useState(false);
  const [cid, setCid] = useState("");
  const [isMoreOptionsToggled, setIsMoreOptionsToggled] = useState(false);
  const [steps, setSteps] = useState<BigInt[]>([]);

  useEffect(() => {
    if (watch("threshold")) setSteps(createStep(Number(watch("threshold"))));
  }, [watch("threshold")]);

  // MARK: - Upload to Server
  const sendCidAndTokenAddressToServer = async (createdTokenAddress: any) => {
    const response = await StoreCidAndTokenAddress({
      cid,
      tokenAddress: createdTokenAddress,
      telegramId: watch("telegramId"),
      description: watch("Description"),
      twitterUrl: watch("twitter") || "",
      telegramUrl: watch("telegram") || "",
      websiteUrl: watch("website") || "",
      name: watch("Name"),
      ticker: watch("Ticker"),
      createdBy: account.address,
      marketCap:
        Number(ethers.formatEther(steps[0].toString())) *
        Number(ethers.formatEther(stepRanges[0].toString())) *
        BILLION,
      threshold: Number(watch("threshold")),
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
    setValue("threshold", e.target.value);
  };

  const handleTelegramIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(
      "telegramId",
      e.target.value.slice(0, 1) === "@"
        ? e.target.value
        : `@${e.target.value}`,
    );
  };

  // MARK: - Validation
  const getUserReserveBalance = async () => {
    try {
      // if (!window.ethereum) {
      //   throw new Error("MetaMask is not installed!");
      // }
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
    // if (await isUserGotMoreThanCreationFee()) {
    //   alert(
    //     `You must have at least ${ethers.formatEther(creationFee)} ${RESERVE_SYMBOL} to create a token.`,
    //   );
    //   return true;
    // }
    if (!watch("threshold")) {
      alert("Invalid input value!");
      return true;
    }
    if (
      watch("threshold") !== "" &&
      (Number(watch("threshold")) < 0.01 ||
        (watch("threshold")?.includes(".") &&
          watch("threshold")?.split(".")[1].length > 2))
    ) {
      alert("Invalid threshold");
      return true;
    }
    if (!watch("prize")) {
      alert("Invalid prize");
      return true;
    }
    if (!watch("Name")) {
      alert("Invalid Name!");
      return true;
    }
    if (!watch("Ticker")) {
      alert("Invalid Ticker!");
      return true;
    }
    if (!watch("Description")) {
      alert("Invalid Description!");
      return true;
    }
    if (!watch("Image")) {
      alert("Invalid Image!");
      return true;
    }
    if (!watch("telegramId")) {
      alert("Invalid Telegram ID!");
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
      console.log("filter", filter.fragment);
      const events = await bondReadContract.queryFilter(filter, -1000);
      console.log("events", events);

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
          maxSupply: ethers.parseEther("1000000000"),
          stepRanges: stepRanges,
          stepPrices: steps,
        },
        {
          value: creationFee.toString(),
        },
      );
      await receipt.wait();
      console.log("Transaction receipt :" + receipt);

      const createdTokenAddress = await fetchTokenAddressFromEvent();
      console.log("Created token address:", createdTokenAddress);
      await sendCidAndTokenAddressToServer(createdTokenAddress);
      setIsLoading(false);

      routeToDetailPageAfterMint();
    } catch (error) {
      const decodedError = await errorDecoder.decode(error);
      console.log("Custom error reason:", decodedError);
      console.error("Error while minting:", error);
      setIsLoading(false);
    }
  };

  const routeToDetailPageAfterMint = async () => {
    router.push(`/`);
  };

  const onInvalid = async () => {
    setSteps(createStep(Number(watch("threshold"))));
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
      {/* <Preview /> */}
      <div className={`preview-title ${impact.variable} font-impact`}>
        Preview
      </div>
      <CreateCard
        {...{
          cid,
          name: watch("Name"),
          ticker: watch("Ticker"),
          prize: watch("prize"),
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
        <div className="flex w-full flex-col items-center">
          <Inputform
            {...{
              name: "telegramId",
              viewName: "Telegram ID",
              onChange: handleTelegramIdChange,
              register,
              value: watch("telegramId"),
            }}
          />
          <div className="mt-2 w-full break-words text-sm text-[#8F8F8F] md:w-[484px]">
            Enter your Telegram ID to receive raffle winner details for prize
            delivery.
          </div>
        </div>
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
