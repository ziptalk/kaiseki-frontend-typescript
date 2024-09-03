import React from "react";
import Image from "next/image";

const values = [
  {
    date: "May, 2024",
    value: [
      {
        cid1: "1",
        cid2: "2",
        name: "Meme",
        createdBy: "mindung",
        ticker: "F1T",
        value1: "-100.001",
        value2: "10.001",
        status: "Win",
      },
      {
        cid1: "1",
        cid2: "2",
        name: "Meme",
        createdBy: "mindung",
        ticker: "F1T",
        value1: "-100.001",
        value2: "10.001",
        status: "Progress",
      },
      {
        cid1: "1",
        name: "Meme",
        createdBy: "mindung",
        ticker: "F1T",
        value1: "-100.001",
        status: "Failed",
      },
    ],
  },
];

export const Trade = () => {
  return (
    <div>
      {values.map((dateValue, idx) => (
        <div key={idx} className="flex flex-col gap-2.5">
          <div className="text-base font-semibold text-white">
            {dateValue.date}
          </div>
          {dateValue.value.map((value) => (
            <div
              key={value.cid1}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-2">
                <div>
                  {value.cid2 ? (
                    <div className="relative h-10 w-10">
                      <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-[#5D5D5D]" />
                      <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-[#5D5D5D]" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#5D5D5D]" />
                  )}
                </div>
                <div>
                  <div className="text-base font-bold text-[#AEAEAE]">
                    {value.name} ticket prize
                  </div>
                  {value.cid2 ? (
                    <div className="flex items-center gap-1 text-sm text-[#AEAEAE]">
                      created by :
                      <Image
                        className="rounded-full"
                        src="/images/memesinoGhost.png"
                        alt=""
                        width={12}
                        height={12}
                        style={{ width: 12, height: 12 }}
                      />
                      {value.createdBy}
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
                <div className="text-sm text-[#8F8F8F]">{value.value1} ETH</div>
                {value.value2 && (
                  <div className="text-sm text-[#EDF102]">
                    {value.value2} {value.ticker}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
