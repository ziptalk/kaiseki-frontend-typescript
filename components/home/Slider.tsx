import React, { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import { RWATokenCard } from "./RwaTokenCard";
import { SlotSection } from "./SlotSection";
import { MainTitle } from "../common/MainTitle";
import { Raffle } from "@/utils/apis/apis";
import { RaffleResponse, TokenResponse } from "@/utils/apis/type";
import { useAccount } from "wagmi";
import Arrow from "@/public/icons/leftArrowCircle.svg";

const SliderComp = () => {
  const account = useAccount();
  const [raffleData, setRaffleData] = useState<RaffleResponse | null>(null);
  const [oldSlide, setOldSlide] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSlide2, setActiveSlide2] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let sliderRef = useRef<Slider>(null);

  useEffect(() => {
    getRaffle();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getRaffle();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getRaffle = async () => {
    try {
      setIsLoading(true);
      const response = await Raffle();

      if (!response) {
        setError("API 응답을 받지 못했습니다.");
      } else {
        setRaffleData(response);
        setError(null);
      }
    } catch (err) {
      console.error("Raffle API 호출 오류:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  let tokens = raffleData?.result?.tokens || [];
  let uniqueTokens: TokenResponse[] = Array.isArray(tokens)
    ? tokens
    : [tokens as TokenResponse];

  const settings = {
    dots: false,
    infinite: uniqueTokens.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: uniqueTokens.length > 1,
    autoplaySpeed: 5000,
    arrows: false,
    className: "raffle-slider",
    beforeChange: (current: number, next: number) => {
      setOldSlide(current);
      setActiveSlide(next);
    },
    afterChange: (current: number) => setActiveSlide2(current),
    lazyLoad: "ondemand" as const,
    fade: false,
    pauseOnHover: true,
    cssEase: "linear",
  };

  const renderRaffleCard = (raffle: TokenResponse, index: number) => {
    let href = "/raffle";
    if (raffleData?.winner?.raffles) {
      for (let i = 0; i < raffleData.winner.raffles.length; i++) {
        if (
          raffleData.winner.raffles[i].tokenAddress === raffle.token &&
          raffleData.winner.raffles[i].winnerAddress === account.address
        ) {
          href = "/raffle/check";
          break;
        } else if (raffleData.winner.raffles[i].tokenAddress === raffle.token) {
          href = "/raffle/fail";
        }
      }
    }

    return (
      <Link
        key={index}
        href={{
          pathname: href,
          query: raffle
            ? {
                cid: raffle.cid,
                rafflePrize: raffle.rafflePrize,
                token: raffle.token,
                name: raffle.name,
                symbol: raffle.symbol,
                creator: raffle.creator,
                description: raffle.description,
                startDate: raffle.startDate,
              }
            : {},
        }}
      >
        <div className="flex w-full flex-col items-center gap-5">
          <MainTitle
            title={
              raffle
                ? href === "/raffle/check" || href === "/raffle/fail"
                  ? "Check the winner!"
                  : "Raffle is ready!"
                : "Loading..."
            }
          />
          {raffle && (
            <>
              <RWATokenCard props={raffle} />
              <SlotSection cid={raffle.cid} />
            </>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="main-inner w-full px-9 md:h-[474px] md:w-[520px] md:px-14">
      {isLoading && !raffleData ? (
        <div className="flex w-full flex-col items-center justify-center">
          <p className="text-lg text-white">Loading...</p>
        </div>
      ) : uniqueTokens.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center">
          <p className="text-lg text-white">There is no ongoing raffle.</p>
        </div>
      ) : uniqueTokens.length > 1 ? (
        <>
          <div className="slider-container w-full">
            <Slider {...settings} ref={sliderRef}>
              {uniqueTokens.map((raffle, index) =>
                renderRaffleCard(raffle, index),
              )}
            </Slider>
          </div>

          <div className="mt-4 flex select-none items-center justify-center gap-3 md:gap-5">
            <Arrow
              fill={"white"}
              className="cursor-pointer"
              onClick={() => {
                sliderRef.current?.slickPrev();
              }}
            />
            <h1 className="text-sm text-white md:text-base">
              {activeSlide + 1} / {uniqueTokens.length}
            </h1>
            <Arrow
              fill={"white"}
              className="rotate-180 transform cursor-pointer"
              onClick={() => {
                sliderRef.current?.slickNext();
              }}
            />
          </div>
        </>
      ) : (
        renderRaffleCard(uniqueTokens[0], 0)
      )}
    </div>
  );
};

export default SliderComp;
