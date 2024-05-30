import Image from "next/image";
import { FC } from "react";

const TradesCard: FC<TradesCardType> = ({
  isBuy,
  seiAmount,
  memeTokenAmount,
  date,
  tx,
  user,
}) => {
  return (
    <>
      <div className="mt-[15px] flex h-[60px] items-center justify-between rounded-[10px] bg-[#242424] px-[10px] text-[#6A6A6A]">
        <div className="flex w-1/6 items-center gap-[5px]">
          <div className="h-[18px] w-[18px] overflow-hidden rounded-full">
            <Image
              src="/images/memesinoGhost.png"
              alt=""
              height={18}
              width={18}
            />
          </div>
          <h1 className="text-[#9AFFC2]">{user}</h1>
        </div>
        <h1 className={`${isBuy ? "text-[#6AD64F]" : "text-[#D64F4F]"} w-1/6`}>
          {isBuy ? "buy" : "sell"}
        </h1>
        <h1 className="w-1/6">{seiAmount}</h1>
        <h1 className="w-1/6">{memeTokenAmount}</h1>
        <h1 className="w-1/6">{date}</h1>
        <h1 className=" flex w-1/6 flex-row-reverse">{tx}</h1>
      </div>
    </>
  );
};

export default TradesCard;
