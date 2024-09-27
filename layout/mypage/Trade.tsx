import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UsersTrades } from "@/utils/apis/apis";
import { ethers } from "ethers";
import { MyTradeResponse } from "@/utils/apis/type";
import { useRouter } from "next/navigation";

export const Trade = ({
  userAddress,
  setModal,
}: {
  userAddress: `0x${string}` | undefined;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const [values, setValues] = useState<any[]>([]);
  const [width, setWidth] = useState(250);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  const fetchValues = async () => {
    setValues(filterEventsByToken(await UsersTrades(userAddress)));
  };

  const filterEventsByToken = (data: MyTradeResponse): any[] => {
    try {
      const filteredMintEvents = data.mintEvents.map((event: any) => ({
        ...event,
        isMint: true,
      }));

      const filteredBurnEvents = data.burnEvents.map((event: any) => ({
        ...event,
        isMint: false,
      }));

      const combinedEvents = [...filteredMintEvents, ...filteredBurnEvents];
      combinedEvents.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      return combinedEvents;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // useEffect(() => {
  //   console.log({ values });
  // }, [values]);

  useEffect(() => {
    fetchValues();
  }, []);
  return (
    <div className="overflow-scroll">
      {values.map((value, idx) => {
        let date = new Date(value.timestamp);
        let newDate = true;
        if (idx > 0) {
          let prevDate = new Date(values[idx - 1].timestamp);
          newDate = date.getDate() !== prevDate.getDate();
        }
        return (
          <div key={idx} className="flex flex-col gap-2.5">
            {newDate && (
              <div className="mt-5 px-5 text-base font-semibold text-white">
                {date.toDateString()}
              </div>
            )}
            <div
              className="flex cursor-pointer items-center justify-between px-5 py-3 md:hover:bg-[#404040]"
              onMouseDown={() => {
                width > 768 && setModal && setModal(false);
                width > 768 && router.push(`/${value.tokenAddress}`);
              }}
            >
              <div className="flex items-center gap-2">
                <div>
                  {value.isMint ? (
                    <div className="relative h-10 w-10">
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${value.cid}`}
                        alt="Image from IPFS"
                        className="absolute left-0 top-0 h-6 w-6 rounded-full"
                      />
                      <img
                        src="/icons/base.svg"
                        alt="base"
                        className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                      />
                    </div>
                  ) : (
                    <div className="relative h-10 w-10">
                      <img
                        src="/icons/base.svg"
                        alt="base"
                        className="absolute left-0 top-0 h-6 w-6 rounded-full"
                      />
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${value.cid}`}
                        alt="Image from IPFS"
                        className="absolute bottom-0 right-0 h-6 w-6 rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-base font-bold text-[#AEAEAE]">
                    {value.tokenName}
                  </div>
                  {true ? (
                    <div className="flex items-center gap-1 truncate whitespace-nowrap text-sm text-[#AEAEAE]">
                      created by :
                      <Image
                        className="rounded-full"
                        src="/icons/bomb.svg"
                        alt=""
                        width={12}
                        height={12}
                        style={{ width: 12, height: 12 }}
                      />
                      {value.tokenCreator &&
                        value.tokenCreator.slice(0, 6) + "..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-sm text-[#AEAEAE]">
                      To : {value.createdBy}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {value.isMint ? (
                  <>
                    <div className="text-sm text-[#8F8F8F]">
                      -{" "}
                      {Number(ethers.formatEther(value.reserveAmount)) <
                      0.00000001
                        ? Number(ethers.formatEther(value.reserveAmount))
                        : Number(
                            ethers.formatEther(value.reserveAmount),
                          ).toFixed(8)}{" "}
                      ETH
                    </div>
                    <div className="text-sm text-[#EDF102]">
                      +{" "}
                      {Math.floor(
                        Number(ethers.formatEther(value.amountMinted)),
                      )}{" "}
                      {value.ticker}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-[#8F8F8F]">
                      -{" "}
                      {Math.floor(
                        Number(ethers.formatEther(value.amountBurned)),
                      )}{" "}
                      {value.ticker}
                    </div>
                    <div className="text-sm text-[#EDF102]">
                      +{" "}
                      {Number(ethers.formatEther(value.refundAmount)) <
                      0.00000001
                        ? Number(ethers.formatEther(value.refundAmount))
                        : Number(
                            ethers.formatEther(value.refundAmount),
                          ).toFixed(8)}{" "}
                      ETH
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
