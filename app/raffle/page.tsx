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
      }, 1000);
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
                src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${kingCid}`}
                alt="Image from IPFS"
                className="h-16 w-16 border-black md:h-[100px] md:w-[100px]"
              />
              <div className="flex w-full flex-col md:px-[10px]">
                <div className="whitespace-pre font-bold text-white md:text-[15px]">
                  {kingName}
                  {"\n"}
                  [ticker: {kingTicker}]
                </div>
                <div className="mt-[5px] flex h-[14px] items-center gap-[5px] ">
                  <h1 className="neon-lime  text-[#C5F900]">created by: </h1>
                  <img
                    className="rounded-full"
                    src="/images/memesinoGhost.png"
                    alt=""
                    style={{ width: 12, height: 12 }}
                  />
                  <div className="neon-lime text-[#C5F900]">
                    {kingCreator.length < 20
                      ? kingCreator
                      : `${kingCreator.slice(0, 20)}...`}
                  </div>
                </div>
                <div className="mt-[3px] flex h-[14px] gap-[5px]">
                  <h1 className="neon-yellow text-[#FAFF00]">market cap :</h1>
                  <h1
                    className={`neon-yellow ${digital.variable} font-digital text-[#FAFF00]`}
                  >
                    {kingMarketCap}K
                  </h1>
                </div>
                <p className="show-scrollbar mt-[5px] h-8 overflow-scroll text-[10px] text-[#808080] md:h-16 md:text-[13px]">
                  {kingDesc}
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-xs font-bold text-[#D9D9D9] underline underline-offset-4 md:mt-3 md:text-[20px]">
                Amount of Tokens
              </h1>
              <div className="relative mt-3 flex w-full items-center md:mt-[20px]">
                <input
                  className="h-10 w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] px-2 text-xs text-white md:h-[55px] md:px-[20px] md:text-base"
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
                  className="absolute right-0 mr-2 flex h-5 w-9 items-center justify-center gap-[5px] rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] text-[10px] text-white md:mr-[20px] md:h-[30px] md:w-[52px] md:px-[10px] md:text-[14px]"
                >
                  MAX
                </button>
              </div>
              <div className="mt-[10px] flex justify-between gap-2">
                {buttonValue.map((item, index) => (
                  <Button
                    key={index}
                    className="h-8 flex-1 rounded-[5px] bg-[#303030] text-xs md:h-[50px] md:text-[14px]"
                    onClick={item.onClick}
                  >
                    {item.value}%
                  </Button>
                ))}
              </div>
              {raffleEnd ? (
                <Button
                  className="mt-5 bg-[#2F2F2F] md:mt-[30px]"
                  onClick={() => setButtonClicked(true)}
                >
                  Raffle has ended
                </Button>
              ) : (
                <Button
                  className="mt-5 md:mt-[30px]"
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
