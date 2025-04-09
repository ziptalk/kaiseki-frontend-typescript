import { useEffect, useState } from "react";
import { anton } from "@/fonts/font";
import { TokenResponse } from "@/utils/apis/type";

export const RWATokenCard = ({ props }: { props: TokenResponse }) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [day, setDay] = useState(0);
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // 유효한 startDate가 있는지 확인
    try {
      if (props?.startDate) {
        const startTime = new Date(props.startDate).getTime();
        if (!isNaN(startTime)) {
          const endTime = startTime + 1000 * 60 * 60 * 24 * 3; // 3일 후
          setTimeLeft(endTime);
        }
      }
    } catch (error) {
      console.error("날짜 변환 오류:", error);
    }
  }, [props?.startDate]);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = timeLeft - now;

      if (distance <= 0) {
        // 시간이 만료된 경우
        setDay(0);
        setHour(0);
        setMinute(0);
        setSecond(0);
        clearInterval(interval);
      } else {
        setDay(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHour(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        );
        setMinute(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSecond(Math.floor((distance % (1000 * 60)) / 1000));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeLeft]);

  const isExpired = timeLeft !== null && timeLeft - new Date().getTime() <= 0;

  return (
    <div className="main-tokenarea mt-[10px] w-full md:h-[120px]">
      {props?.cid && (
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${props.cid}`}
          alt="Image from IPFS"
          className="h-[66px] w-[66px] border-black md:h-[100px] md:w-[100px]"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            e.currentTarget.src = "/icons/userIcon.svg";
          }}
        />
      )}
      <div
        className={`flex flex-col`}
        style={{ width: width < 768 ? width - 230 : 270 }}
      >
        <div className="whitespace-pre break-words text-xs font-bold text-white md:text-sm">
          {props?.name || "Unknown"}
          {"\n"}
          {`[ticker: ${props?.symbol || "---"}]`}
        </div>
        <div className="mt-0.5 flex h-[14px] items-center gap-[2px] text-xs md:gap-[5px]">
          <div className=" whitespace-nowrap text-white">created by: </div>
          <img className="h-3 w-3" src="/icons/userIcon.svg" alt="" />
          <div className=" truncate text-white">
            {width < 768
              ? props?.creator
                ? props.creator.slice(0, 6) + "..."
                : "---"
              : props?.creator || "---"}
          </div>
        </div>
        <div className="text-xs text-white">
          prize : {props?.rafflePrize || "---"}
        </div>
        <div
          className={`raffle-typo ${anton.variable} font-anton text-sm md:text-lg`}
        >
          {!isExpired && timeLeft ? (
            `${day} Day ${hour.toString().padStart(2, "0")}:
          ${minute.toString().padStart(2, "0")} :
          ${second.toString().padStart(2, "0")} left!`
          ) : (
            <img src="/images/checkTheWinner.gif" alt="Raffle End" />
          )}
        </div>
      </div>
    </div>
  );
};
