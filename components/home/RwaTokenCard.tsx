import { FC, useEffect, useState } from "react";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { digital } from "@/fonts/font";
import { anton } from "@/fonts/font";

export const RWATokenCard: FC = () => {
  const time = 1725839354679;
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
    // Calculate the remaining time
    const interval = setInterval(() => {
      const now = new Date().getTime();

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
  const [kingToken, setKingToken] = useState("0");
  // const [kingDesc, setKingDesc] = useState(
  //   "Figma ipsum component variant main layer. Stroke opacity blur style bullet group library pencil content. Pencil effect underline pencil pixel follower.",
  // );
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
          setKingCid(data[0].cid);
          setKingMarketCap(data[0].marketCap);
          setKingToken(data[0].token);
          setKingName(data[0].name);
          setKingTicker(data[0].symbol);
          setKingCreator(data[0].creator);
          // setKingDesc(data[0].description);
        }
        console.log({ tothemoon: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="main-tokenarea mt-[10px] w-full md:h-[120px]">
      <img
        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${kingCid}`}
        alt="Image from IPFS"
        className="h-[66px] w-[66px] border-black md:h-[100px] md:w-[100px]"
      />
      <div className="flex w-full flex-col">
        <div className=" whitespace-pre break-words text-xs font-bold text-white md:text-base">
          {kingName}
          {"\n"}
          {`[ticker: ${kingTicker}]`}
        </div>
        <div className="mt-0.5 flex h-[14px] items-center gap-[2px] text-xs md:gap-[5px]">
          <div className="neon-lime text-[#C5F900]">created by: </div>
          <img
            className="h-2 w-2 rounded-full md:h-3 md:w-3"
            src="/images/memesinoGhost.png"
            alt=""
          />
          <div className="neon-lime text-[#C5F900]">
            {kingCreator.length < 10
              ? kingCreator
              : `${kingCreator.slice(0, 7)}...`}
          </div>
        </div>
        <div className="text-xs text-[#FAFF00]">prize : {kingTicker}</div>
        <div
          className={`raffle-typo ${anton.variable} font-anton text-sm md:text-lg`}
        >
          {day} Day {hour.toString().padStart(2, "0")}:
          {minute.toString().padStart(2, "0")}{" "}
          {/* :{second.toString().padStart(2, "0")} */}
          left!
        </div>
      </div>
    </div>
  );
};
