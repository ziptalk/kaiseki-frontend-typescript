import React from "react";
import Image from "next/image";

const values = [
  {
    date: "May, 2024",
    value: [
      {
        cid: "1",
        name: "Meme",
        createdBy: "mindung",
        status: "Win",
      },
      {
        cid: "1",
        name: "Meme",
        createdBy: "mindung",
        status: "Progress",
      },
      {
        cid: "1",
        name: "Meme",
        createdBy: "mindung",
        status: "Failed",
      },
    ],
  },
];

export const Raffle = () => {
  return (
    <div>
      {values.map((dateValue, idx) => (
        <div key={idx} className="flex flex-col gap-2.5">
          <div className="text-base font-semibold text-white">
            {dateValue.date}
          </div>
          {dateValue.value.map((value) => (
            <div
              key={value.cid}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-[#5D5D5D]" />
                <div>
                  <div className="text-base font-bold text-[#AEAEAE]">
                    {value.name} ticket prize
                  </div>
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
                </div>
              </div>
              <div
                className={`h-6 w-24 rounded-full ${value.status === "Win" ? "winStyle" : value.status === "Progress" ? "progressStyle" : "bg-[#7D7D7D] text-white"} flex items-center justify-center text-xs font-bold`}
              >
                {value.status}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
