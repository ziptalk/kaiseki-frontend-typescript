import React from "react";
import Image from "next/image";
import { digital } from "@/fonts/font";

interface CreateCardProps {
  cid: string;
  name: string;
  ticker: string;
  address: string;
  description: string;
}
export const CreateCard = ({
  cid,
  name,
  ticker,
  address,
  description,
}: CreateCardProps) => {
  return (
    <div className="main-tokenarea md:w-[420px]">
      {cid !== "" ? (
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className="h-[120px] w-[120px]"
        />
      ) : (
        <img
          src={`http://via.placeholder.com/120x120`}
          alt="Image from IPFS"
          className="h-[120px] w-[120px] bg-[#D9D9D9]"
        />
      )}
      <div className="flex w-full flex-col gap-1 overflow-hidden">
        <h1 className="whitespace-pre-line text-base font-bold leading-none text-[#AEAEAE]">
          {name || "Name"}
          {"\n"}
          [ticker: {ticker || "ticker"}]
        </h1>
        <div className="flex items-center gap-1">
          <p className="neon-lime text-xs text-[#C5F900] ">Created by:</p>
          <Image
            className="rounded-full"
            src="/images/memesinoGhost.png"
            alt=""
            width={12}
            height={12}
            style={{ width: 12, height: 12 }}
          />
          <p className="neon-lime text-xs text-[#C5F900] ">{address}</p>
        </div>

        <div className="flex">
          <p className="neon-yellow text-xs text-[#FAFF00]">
            Market cap:&nbsp;
          </p>
          <p
            className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
          >
            0.00K
          </p>
        </div>

        <div className=" w-full break-words text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
          {description}
        </div>
      </div>
    </div>
  );
};
