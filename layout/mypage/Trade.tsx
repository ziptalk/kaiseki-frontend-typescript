import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UsersTrades } from "@/utils/apis/apis";
import { ethers } from "ethers";

export const Trade = ({
  userAddress,
}: {
  userAddress: `0x${string}` | undefined;
}) => {
  const [values, setValues] = useState<any[]>([]);

  const fetchValues = async () => {
    setValues(filterEventsByToken(await UsersTrades(userAddress)));
  };
  useEffect(() => {
    console.log(values);
  }, [values]);
  const filterEventsByToken = (data: any): Event[] => {
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
  useEffect(() => {
    fetchValues();
  }, []);
  return (
    <div>
      {values.map((value, idx) => (
        <div key={idx} className="flex flex-col gap-2.5">
          {/* <div className="text-base font-semibold text-white">
            {dateValue.date}
          </div> */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <div>
                {value.isMint ? (
                  <div className="relative h-10 w-10">
                    <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#5D5D5D]" />
                    <img
                      src="/icons/base.svg"
                      alt="base"
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#5D5D5D]"
                    />
                  </div>
                ) : (
                  <div className="relative h-10 w-10">
                    <img
                      src="/icons/base.svg"
                      alt="base"
                      className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#5D5D5D]"
                    />
                    <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#5D5D5D]" />
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
                      src="/images/memesinoGhost.png"
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
                    {/* <Image
                        className="rounded-full"
                        src="/images/memesinoGhost.png"
                        alt=""
                        width={12}
                        height={12}
                        style={{ width: 12, height: 12 }}
                      /> */}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              {value.isMint ? (
                <>
                  <div className="text-sm text-[#8F8F8F]">
                    - {Number(ethers.formatEther(value.reserveAmount))} ETH
                  </div>
                  <div className="text-sm text-[#EDF102]">
                    + {Number(ethers.formatEther(value.amountMinted))}{" "}
                    {value.tokenName}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-[#8F8F8F]">
                    - {Number(ethers.formatEther(value.amountBurned))}{" "}
                    {value.tokenName}
                  </div>
                  <div className="text-sm text-[#EDF102]">
                    + {Number(ethers.formatEther(value.refundAmount))} ETH
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
