"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { anton, digital } from "@/fonts/font";

export default function Raffle() {
  const [raffleEnd, setRaffleEnd] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [success, setSuccess] = useState(false);

  // useEffect(() => {
  //   console.log({ hoveredToken });
  //   console.log({ clickedToken });
  // }, [hoveredToken, clickedToken]);
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
    <div className=" mb-[154px] ">
      <div
        className={
          "mx-auto mt-[42px]  flex h-[644px] w-[1151px] items-center justify-center rounded-2xl border-2 border-[#FAFF00] bg-gradient-to-b from-red-600 to-red-800 shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FAFF00]"
        }
      >
        <div className="flex h-[584px] w-[510px] flex-col items-center gap-[30px] rounded-3xl border-2 border-white bg-black py-[20px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-white">
          <div className="rounded-[5px] bg-gradient-to-t from-yellow-300 to-white p-[2px]">
            <div className="flex h-[60px] w-[390px] items-center justify-center rounded-[5px] bg-gradient-to-t from-[#670C0C] to-[#191919]">
              <div
                className={`title-typo ${anton.variable} font-anton absolute`}
              >
                Join the Raffle!
              </div>
              <div className={`title-shadow ${anton.variable} font-anton `}>
                Join the Raffle!
              </div>
            </div>
          </div>

          <div className="flex h-[434px] w-[400px] flex-col border border-dashed border-[#F9FF00]  bg-black p-[10px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]">
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
                  Pizza ipsum dolor meat lovers buffalo. Bacon Aussie mozzarella
                  buffalo hand lovers string. Chicago garlic roll banana
                </div>
              </div>
            </div>
            <div className="mt-[10px]">
              <h1 className="text-[20px] font-bold text-white underline">
                Amount of Tokens
              </h1>
              <div className="relative mt-[20px] flex w-full items-center">
                <input
                  className="h-[55px] w-full rounded-[10px] border border-[#5C5C5C] bg-[#454545] px-[20px] text-[#FFFFFF]"
                  type="number"
                  // placeholder="0.00"
                  step="0.01"
                  name="inputValue"
                  // value={inputValue}
                  // onChange={handleInputChange}
                />
                <button
                  type="button"
                  // onClick={() => handlePercentage(100)}
                  className="absolute right-0 mr-[20px] flex h-[30px] w-[52px] items-center gap-[5px] rounded-[4px] border border-[#8F8F8F] bg-[#0E0E0E] px-[10px] text-[14px] text-white"
                >
                  MAX
                </button>
              </div>
              <div className="mt-[10px] flex justify-between">
                <button className="h-[50px] w-[117px] rounded-[5px] bg-[#303030] text-[14px] font-bold text-white">
                  10%
                </button>

                <button className="h-[50px] w-[117px] rounded-[5px] bg-[#303030] text-[14px] font-bold text-white">
                  50%
                </button>

                <button className="h-[50px] w-[117px] rounded-[5px] bg-[#303030] text-[14px] font-bold text-white">
                  100%
                </button>
              </div>
              {raffleEnd ? (
                <button
                  className="mt-[30px] h-[60px] w-full rounded-[10px] bg-[#2F2F2F] font-bold text-white"
                  onClick={() => setButtonClicked(true)}
                >
                  Raffle has ended
                </button>
              ) : (
                <button
                  className="mt-[30px] h-[60px] w-full rounded-[10px] bg-[#950000] font-bold text-white"
                  onClick={() => setButtonClicked(true)}
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {success ? (
        <div
          className={`mx-auto mt-[61px] flex h-[100px] w-[484px] items-center justify-center rounded-[10px] bg-[#4F4F4F80] text-[16px] font-bold text-white${buttonClicked ? "opacity-0" : "opacity-100"} duration-500`}
        >
          <Image
            className="mr-[6px]"
            src={"/icons/complete.svg"}
            alt="Raffle"
            width={17}
            height={17}
            style={{ width: 17, height: 17 }}
          />
          Raffle has been successfully completed!
        </div>
      ) : (
        <div
          className={`mx-auto mt-[61px] flex h-[100px] w-[484px] items-center justify-center rounded-[10px] bg-[#4F4F4F80] text-[16px] font-bold text-white ${buttonClicked ? "opacity-100" : "opacity-0"} duration-500`}
        >
          <Image
            className="mr-[6px]"
            src={"/icons/fail.svg"}
            alt="Raffle"
            width={17}
            height={17}
            style={{ width: 17, height: 17 }}
          />
          Raffle did not run properly. Please try again.
        </div>
      )}
    </div>
  );
}
