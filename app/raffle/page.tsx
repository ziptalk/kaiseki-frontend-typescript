"use client";

import { useEffect, useState } from "react";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { digital } from "@/fonts/font";
import { MainTitle } from "@/components/common/MainTitle";
import { Button } from "@/components/atoms/Button";
import { PageLinkButton } from "@/components/atoms/PageLinkButton";
import { AlertInfo } from "@/components/atoms/AlertInfo";

export default function Raffle() {
  const [raffleEnd, setRaffleEnd] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inputValue, setInputValue] = useState(0);

  const buttonValue = [
    {
      value: 10,
      onClick: () => setInputValue(10),
    },
    {
      value: 50,
      onClick: () => setInputValue(50),
    },
    {
      value: 100,
      onClick: () => setInputValue(100),
    },
  ];

  useEffect(() => {
    if (buttonClicked) {
      setTimeout(() => {
        setButtonClicked(false);
      }, 3000);
    }
  }, [buttonClicked]);

  const [kingName, setKingName] = useState("KingCat");
  const [kingTicker, setKingTicker] = useState("KING");
  const [kingCreator, setKingCreator] = useState("Me");
  const [kingMarketCap, setKingMarketCap] = useState("0");
  const [kingDesc, setKingDesc] = useState(
    "Figma ipsum component variant main layer. Stroke opacity blur style bullet group library pencil content. Pencil effect underline pencil pixel follower.",
  );
  const [kingCid, setKingCid] = useState(
    "QmeSwf4GCPw1TBpimcB5zoreCbgGL5fEo7kTfMjrNAXb3U",
  );

  // useEffect(() => {
  //   getToTheMoonFromServer();
  // }, []);

  const getToTheMoonFromServer = () => {
    fetch(`${SERVER_ENDPOINT}/ToTheMoon`) // Add this block
      .then((response) => response.json())
      .then((data) => {
        if (data[0]) {
          setKingName(data[0].name);
          setKingTicker(data[0].symbol);
          setKingCid(data[0].cid);
          setKingCreator(data[0].creator);
          setKingDesc(data[0].description);
          setKingMarketCap(data[0].marketCap);
        }
        console.log({ tothemoon: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="mb-[154px]">
      <div className="mx-auto mt-3">
        <PageLinkButton href={"/"} prev>
          Back Home
        </PageLinkButton>
      </div>
      <div className={"main mt-[10px] h-[644px] w-[1151px]"}>
        <div className="main-inner h-[584px] w-[510px]">
          <MainTitle title="Join the Raffle!" />
          <div className="main-tokenarea h-[434px] w-[400px] flex-col">
            <div className="flex h-[161px] gap-[10px] overflow-scroll">
              <img
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${kingCid}`}
                alt="Image from IPFS"
                className="h-[100px] w-[100px] border-black"
              />
              <div className="flex w-full flex-col px-[10px]">
                <h1 className="h-[17px] text-[15px] font-bold text-[#AEAEAE]">
                  {kingName}
                </h1>
                <h2 className="h-[17px] text-[15px] font-bold text-[#AEAEAE]">
                  [ticker: {kingTicker}]
                </h2>
                <div className="mt-[5px] flex h-[14px] items-center gap-[5px] ">
                  <h1 className="neon-lime text-[12px] text-[#C5F900]">
                    created by:{" "}
                  </h1>
                  <img
                    className="rounded-full"
                    src="/images/memesinoGhost.png"
                    alt=""
                    style={{ width: 12, height: 12 }}
                  />
                  <h1 className="neon-lime mt-[5px] text-[12px] text-[#C5F900]">
                    {kingCreator.length < 20
                      ? kingCreator
                      : `${kingCreator.slice(0, 20)}...`}
                  </h1>
                </div>
                <div className="mt-[3px] flex h-[14px] gap-[5px]">
                  <h1 className="neon-yellow text-xs text-[#FAFF00]">
                    market cap :
                  </h1>
                  <h1
                    className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
                  >
                    {kingMarketCap}K
                  </h1>
                </div>
                <div className="mt-[5px] text-[13px] text-[#808080] ">
                  {kingDesc}
                </div>
              </div>
            </div>
            <div className="mt-[10px]">
              <h1 className="text-[20px] font-bold text-[#D9D9D9] underline underline-offset-4">
                Amount of Tokens
              </h1>
              <div className="relative mt-[20px] flex w-full items-center">
                <input
                  className="h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-[#454545] px-[20px] text-white"
                  type="number"
                  // placeholder="0.00"
                  step="0.01"
                  name="inputValue"
                  value={inputValue}
                  // onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setInputValue(200)}
                  className="absolute right-0 mr-[20px] flex h-[30px] w-[52px] items-center gap-[5px] rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] px-[10px] text-[14px] text-white"
                >
                  MAX
                </button>
              </div>
              <div className="mt-[10px] flex justify-between">
                {buttonValue.map((item, index) => (
                  <Button
                    key={index}
                    className="h-[50px] w-[117px] rounded-[5px] bg-[#303030] text-[14px]"
                    onClick={item.onClick}
                  >
                    {item.value}%
                  </Button>
                ))}
              </div>
              {raffleEnd ? (
                <Button
                  className="mt-[30px] bg-[#2F2F2F]"
                  onClick={() => setButtonClicked(true)}
                >
                  Raffle has ended
                </Button>
              ) : (
                <Button
                  className="mt-[30px]"
                  onClick={() => setButtonClicked(true)}
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <AlertInfo {...{ buttonClicked, success }} />
    </div>
  );
}
