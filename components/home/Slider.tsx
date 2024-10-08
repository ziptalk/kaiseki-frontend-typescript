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
  let sliderRef = useRef<Slider>(null);
  useEffect(() => {
    getRaffle();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getRaffle();
    }, 5000);
    return () => clearInterval(interval);
  }, [raffleData]);

  const getRaffle = async () => {
    const response = await Raffle();
    setRaffleData(response);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    beforeChange: (current: number, next: number) => {
      setOldSlide(current);
      setActiveSlide(next);
    },
    afterChange: (current: number) => setActiveSlide2(current),
  };
  return (
    <div className="main-inner w-full px-9 md:h-[474px] md:w-[520px] md:px-14">
      <Slider {...settings} className="h-full w-full" ref={sliderRef}>
        {raffleData &&
          raffleData.result &&
          raffleData.result.tokens &&
          raffleData.result.tokens.map(
            (raffle: TokenResponse, index: number) => {
              let href = "/raffle";
              for (let i = 0; i < raffleData.winner.raffles.length; i++) {
                if (
                  raffleData.winner.raffles[i].tokenAddress === raffle.token &&
                  raffleData.winner.raffles[i].winnerAddress === account.address
                ) {
                  href = "/raffle/check";
                  return;
                } else if (
                  raffleData.winner.raffles[i].tokenAddress === raffle.token
                ) {
                  href = "/raffle/fail";
                }
              }
              return (
                <Link
                  key={index}
                  href={{
                    pathname: href,
                    query: raffle &&
                      raffle && {
                        cid: raffle.cid,
                        rafflePrize: raffle.rafflePrize,
                        token: raffle.token,
                        name: raffle.name,
                        symbol: raffle.symbol,
                        creator: raffle.creator,
                        description: raffle.description,
                        startDate: raffle.startDate,
                      },
                  }}
                >
                  <div className="flex w-full flex-col items-center gap-5">
                    <MainTitle
                      title={
                        raffle && raffle.token
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
            },
          )}
        {/* {raffleData && raffleData.result.tokens.length} */}
      </Slider>

      {raffleData && raffleData.result.tokens && (
        <div className="flex select-none items-center gap-3 md:gap-5">
          <Arrow
            fill={"white"}
            className="cursor-pointer"
            onClick={() => {
              sliderRef.current?.slickPrev();
            }}
          />
          <h1 className="text-sm text-white md:text-base">
            {activeSlide + 1} / {raffleData.result.tokens.length || 0}
          </h1>
          <Arrow
            fill={"white"}
            className="rotate-180 transform cursor-pointer"
            onClick={() => {
              sliderRef.current?.slickNext();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SliderComp;
