"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MainTitle } from "@/components/common/MainTitle";
import { Button } from "@/components/atoms/Button";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { AlertInfo } from "@/components/atoms/AlertInfo";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import MCV2_TokenArtifact from "@/abis/MCV2_Token.sol/MCV2_Token.json";
import { ether, wei } from "@/utils/weiAndEther";
import contracts from "@/global/contracts";
import MCV2_MultiTokenReceiver from "@/abis/MCV2_MultiTokenReceiver.sol/MultiTokenReceiver.json";
import IERC20_abi from "@/abis/MCV2_MultiTokenReceiver.sol/IERC20.json";
import { useEthersSigner } from "@/utils/ethersSigner";
import { RaffleEnter } from "@/utils/apis/apis";

export default function Raffle() {
  const signer = useEthersSigner();
  const searchParams = useSearchParams();
  const account = useAccount();

  const [buttonClicked, setButtonClicked] = useState(false);
  const [success, setSuccess] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [width, setWidth] = useState(250);
  const [curMemeTokenValue, setCurMemeTokenValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const { abi: MCV2_TokenABI } = MCV2_TokenArtifact;
  const { abi: MCV2_MultiTokenABI } = MCV2_MultiTokenReceiver;
  const { abi: erc20Abi } = IERC20_abi;
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_BASE);
  const memeTokenContract = new ethers.Contract(
    searchParams.get("token") || "",
    MCV2_TokenABI,
    provider,
  );

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    setUserMemeTokenBalanceIntoState();
  }, [account]);

  useEffect(() => {
    if (inputValue === "0") {
      setInputValue("");
    }
  }, []);

  useEffect(() => {
    if (buttonClicked) {
      setTimeout(() => {
        setButtonClicked(false);
      }, 2000);
    }
  }, [buttonClicked]);

  const buttonValue = [
    {
      value: 25,
      onClick: () => setInputValue((curMemeTokenValue * 0.25).toFixed()),
    },
    {
      value: 50,
      onClick: () => setInputValue((curMemeTokenValue * 0.5).toFixed()),
    },
    {
      value: 75,
      onClick: () => setInputValue((curMemeTokenValue * 0.75).toFixed()),
    },
  ];

  const setUserMemeTokenBalanceIntoState = async () => {
    try {
      if (account.address == null) {
        setCurMemeTokenValue(0);
        return;
      }
      const detail = await memeTokenContract.balanceOf(account.address);
      setCurMemeTokenValue(ether(detail));
    } catch (error) {
      console.log(error);
    }
  };

  async function depositTokens(tokenAddress: string, amount: number) {
    setLoading(true);
    try {
      const multiTokenReceiverContract = new ethers.Contract(
        contracts.MCV2_MultiTokenReceiver, // MultiTokenReceiver 컨트랙트 주소
        MCV2_MultiTokenABI, // MultiTokenReceiver ABI
        signer, // 서명자 (signer)
      );

      // 먼저 토큰을 전송할 수 있도록 approve 호출
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const txApprove = await tokenContract.approve(
        contracts.MCV2_MultiTokenReceiver,
        BigInt(wei(Number(amount))),
        // amount,
      );
      await txApprove.wait();

      // deposit 함수 호출
      const txDeposit = await multiTokenReceiverContract.deposit(
        tokenAddress,
        BigInt(wei(Number(amount))),
        // amount,
      );
      await txDeposit.wait();
      setSuccess(true);
      setButtonClicked(true);

      console.log(`Deposited ${amount} tokens to MultiTokenReceiver contract`);
      await RaffleEnter({
        tokenAddress: searchParams.get("token") || "",
        tokenAmount: Number(Number(inputValue).toFixed()),
        userAddress: account.address,
      });
    } catch (err) {
      setSuccess(false);
      setButtonClicked(true);
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <div className="p-2">
      <div className="mx-auto mt-3 w-full md:w-[1151px]">
        <PageLinkButton href={"/"} prev>
          Back Home
        </PageLinkButton>
      </div>
      <div className={"main mt-[10px] p-5 md:w-[1151px] md:px-80"}>
        <div className="main-inner px-9 py-5 md:px-16 md:py-8">
          <MainTitle title="Join the Raffle!" />
          <div className="main-tokenarea mt-4 flex-col">
            <div className="flex gap-[10px] text-xs">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${searchParams.get("cid")}`}
                alt="Image from IPFS"
                className="h-16 w-16 border-black md:h-[100px] md:w-[100px]"
              />
              <div
                className="flex flex-col md:px-[10px]"
                style={{ width: width < 768 ? width - 250 : 240 }}
              >
                <div className="whitespace-pre font-bold text-[#AEAEAE] md:text-[15px]">
                  {searchParams.get("name")}
                  {"\n"}
                  [ticker: {searchParams.get("symbol")}]
                </div>
                <div className="mt-[5px] flex h-[14px] items-center gap-[5px] ">
                  <h1 className="whitespace-nowrap text-[#C5F900]">
                    created by:{" "}
                  </h1>
                  <img
                    className="rounded-full"
                    src="/icons/bomb.svg"
                    alt=""
                    style={{ width: 12, height: 12 }}
                  />
                  <div className="w-full truncate text-[#C5F900]">
                    {/* {searchParams.get("creator").length < 20
                      ? searchParams.get("creator")
                      : `${searchParams.get("creator").slice(0, 20)}...`} */}
                    {searchParams.get("creator")}
                  </div>
                </div>
                <h1 className="text-[#FAFF00]">
                  prize: {searchParams.get("rafflePrize")}
                </h1>
                <p className="show-scrollbar mt-[5px] h-8 overflow-scroll break-words text-[10px] text-[#808080] md:h-16 md:text-[13px]">
                  {searchParams.get("description")}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-xs font-bold text-[#D9D9D9] underline underline-offset-4 md:mt-3 md:text-base">
                Amount of Tokens
              </h1>
              <div className="relative mt-3 flex w-full items-center md:mt-[20px]">
                <input
                  className="h-10 w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] px-2 text-xs text-white md:h-[55px] md:px-[20px] md:text-base"
                  type="number"
                  name="inputValue"
                  placeholder="0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setInputValue(curMemeTokenValue.toFixed())}
                  className="absolute right-0 mr-2 flex h-5 w-9 items-center justify-center gap-[5px] rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] text-[10px] text-white hover:bg-[#950000] md:mr-[20px] md:h-[30px] md:w-[52px] md:px-[10px] md:text-[14px]"
                >
                  MAX
                </button>
              </div>
              <div className="mt-[10px] flex justify-between gap-2 md:gap-3">
                {buttonValue.map((item, index) => (
                  <Button
                    key={index}
                    className="h-8 flex-1 rounded-[5px] bg-[#303030] text-xs hover:bg-[#454545] md:h-[50px] md:text-[14px]"
                    onClick={item.onClick}
                    off
                  >
                    {item.value}%
                  </Button>
                ))}
              </div>

              <Button
                className="mt-5 md:mt-[30px]"
                onClick={() => {
                  if (Number(inputValue) > curMemeTokenValue) {
                    setSuccess(false);
                    setButtonClicked(true);
                  } else {
                    depositTokens(
                      searchParams.get("token") || "",
                      Number(inputValue),
                    );
                  }
                }}
              >
                {loading ? (
                  <Image
                    src="/icons/Loading.svg"
                    alt="loading Icon"
                    height={24}
                    width={24}
                    className="animate-spin"
                  />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AlertInfo {...{ buttonClicked, success }} />
    </div>
  );
}
