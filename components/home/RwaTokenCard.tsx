import { FC, useEffect, useState } from "react";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { TokenDesc } from "../common/TokenDesc";
import { digital } from "@/fonts/font";
import { anton } from "@/fonts/font";

export const RWATokenCard: FC = () => {
  const time = 1725839354679;
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      console.log(now);
      const distance = time - now;
      setDay(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHour(
        Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      );
      setMinute(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSecond(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    getToTheMoonFromServer();
  }, []);

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
        // console.log({ tothemoon: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex h-[120px] w-[390px] justify-between gap-[10px] border border-dashed border-[#F9FF00] bg-black p-[10px]  shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]">
      <img
        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${kingCid}`}
        alt="Image from IPFS"
        className="h-[100px] w-[100px] border-black"
      />
      <div className="flex w-full flex-col">
        <h1 className="h-[17px] text-[15px] font-bold text-white">
          {kingName}
        </h1>
        <h2 className="mt-[4px] h-[17px] text-[15px] font-bold text-white">
          [ticker: {kingTicker}]
        </h2>
        <div className="mt-[5px] flex h-[14px] items-center gap-[5px] ">
          <h1 className="neon-lime text-[12px] text-[#C5F900]">created by: </h1>
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
        <div className="flex h-[14px]  gap-[5px]">
          <h1 className="neon-yellow text-xs text-[#FAFF00]">market cap :</h1>
          <h1
            className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
          >
            {kingMarketCap}K
          </h1>
        </div>
        <div className={`raffle-typo ${anton.variable} font-anton`}>
          {day} Day {hour}:{minute}:{second} left!
        </div>
      </div>
    </div>
  );
};
