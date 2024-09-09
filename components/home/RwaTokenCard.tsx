import { useEffect, useState } from "react";
import { anton } from "@/fonts/font";
import { TokenResponse } from "@/utils/apis/type";

export const RWATokenCard = ({ props }: { props: TokenResponse }) => {
  const time = new Date(props.startDate).getTime() + 1000 * 60 * 60 * 24 * 3;
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(() => {
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
    return () => {
      clearInterval(interval);
    };
  }, [time]);
  return (
    <div className="main-tokenarea mt-[10px] w-full md:h-[120px]">
      <img
        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${props.cid}`}
        alt="Image from IPFS"
        className="h-[66px] w-[66px] border-black md:h-[100px] md:w-[100px]"
      />
      <div className="flex w-full flex-col">
        <div className=" whitespace-pre break-words text-xs font-bold text-white md:text-sm">
          {props.name}
          {"\n"}
          {`[ticker: ${props.symbol}]`}
        </div>
        <div className="mt-0.5 flex h-[14px] items-center gap-[2px] text-xs md:gap-[5px]">
          <div className="neon-lime whitespace-nowrap text-[#C5F900]">
            created by:{" "}
          </div>
          <img
            className="h-2 w-2 rounded-full md:h-3 md:w-3"
            src="/images/memesinoGhost.png"
            alt=""
          />
          <div className="neon-lime truncate text-[#C5F900]">
            {props.creator}
          </div>
        </div>
        <div className="text-xs text-[#FAFF00]">
          prize : {props.rafflePrize}
        </div>
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
