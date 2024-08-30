import Image from "next/image";
import { FC } from "react";

const TokenCard: FC<TokenCardTypes> = ({
  name,
  cid,
  ticker,
  createdBy,
  description,
}) => {
  return (
    <div
      className={`flex w-[400px] flex-col items-center justify-between rounded-lg border border-white border-opacity-50 bg-[#1C1C1C] p-[20px]`}
    >
      <div className="w-full text-[14px] font-bold text-white">
        {name}
        <div className="ml-[4px] inline text-[14px] font-bold text-[#9F9FB1]">
          [ticker:{ticker}]
        </div>
      </div>
      <div className="mt-[8px] flex gap-[20px]">
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className="h-[120px] w-[120px]"
        />
        <div className="h-[90px] w-[220px] text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
          <div className="h-[100px] text-[#6B6B6B]">{description}</div>
          <div className="flex items-center gap-[5px]">
            <h1 className="text-xs text-[#C5F900] ">Created by:</h1>
            <Image
              className="rounded-full"
              src="/images/memesinoGhost.png"
              alt=""
              width={12}
              height={12}
              style={{ width: 12, height: 12 }}
            />
            <div className="text-xs text-[#C5F900] ">
              {createdBy.slice(0, 7)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
