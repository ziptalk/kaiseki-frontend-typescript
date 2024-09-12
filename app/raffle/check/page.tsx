"use client";

import { useEffect, useState } from "react";
import { MainTitle } from "@/components/common/MainTitle";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/atoms/Button";
import { AlertInfo } from "@/components/atoms/AlertInfo";
import { RaffleTelegramId } from "@/utils/apis/apis";

export default function Raffle() {
  const searchParams = useSearchParams();
  const account = useAccount();

  const [inputValue, setInputValue] = useState("@");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [success, setSuccess] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [gifOn, setGifOn] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setGifOn(false);
    }, 2000);
  }, []);

  const onButtonClick = async () => {
    const result = await RaffleTelegramId({
      winnerAddress: account.address,
      telegramId: inputValue,
      tokenAddress: searchParams.get("token") || "",
    });
    if (result.error) {
      setErrorMsg(result.message);
      setSuccess(false);
    } else {
      setSuccess(true);
    }
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
    }, 3000);
  };

  return (
    <div className="p-2">
      {gifOn && (
        <img
          src="/images/congratulation.gif"
          alt="congrats"
          className="fixed h-full w-full"
        />
      )}
      <div className="mx-auto mt-3 w-full md:w-[1151px]">
        <PageLinkButton href={"/"} prev>
          Back Home
        </PageLinkButton>
      </div>
      <div className={"main mt-[10px] p-5 md:w-[1151px] md:px-80"}>
        <div className="main-inner px-9 py-5 md:px-[50px] md:py-8">
          <MainTitle title="Congrats! 🎉 Enjoy your win!" />
          <div className="main-tokenarea mt-4 flex-col md:px-0">
            <div className="flex w-full flex-col gap-1.5 text-sm md:px-[75px]">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${searchParams.get("cid")}`}
                alt="Image from IPFS"
                className="flex-1 border-black"
              />
              <div className="flex w-full flex-col md:px-[10px]">
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
                  <div className="w-full truncate text-[#FAFF00]">
                    {/* {searchParams.get("creator").length < 20
                      ? searchParams.get("creator")
                      : `${searchParams.get("creator").slice(0, 20)}...`} */}
                    {searchParams.get("creator")}
                  </div>
                </div>
                <h1 className="text-[#C5F900]">
                  prize: {searchParams.get("rafflePrize")}
                </h1>
                <p className="mt-[5px] break-words text-[10px] text-[#808080] md:text-[12px]">
                  {searchParams.get("description")}
                </p>
              </div>
            </div>
            <div className="md:px-3">
              <h1 className="text-xs font-bold text-[#D9D9D9] underline underline-offset-4 md:mt-3 md:text-base">
                Please enter your Telegram ID here:
              </h1>
              <div className="mt-1 w-full items-center md:mt-2">
                <input
                  className="h-10 w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] px-2 text-xs text-white md:h-[55px] md:px-[20px] md:text-base"
                  type="text"
                  name="inputValue"
                  autoComplete="off"
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(
                      e.target.value.slice(0, 1) === "@"
                        ? e.target.value
                        : `@${e.target.value}`,
                    )
                  }
                />
                <Button className="mt-2 md:h-[55px]" onClick={onButtonClick}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertInfo
        {...{
          buttonClicked,
          success,
          successMessage: "Your Telegram ID has been successfully submitted!",
          failMessage:
            errorMsg || "Telegram ID did not run properly. Please try again.",
        }}
      />
    </div>
  );
}
