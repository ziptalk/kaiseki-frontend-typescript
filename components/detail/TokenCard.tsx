import Image from "next/image";
import { FC } from "react";
import Telegram from "@/public/icons/telegram_logo.svg";
import X from "@/public/icons/X_logo.svg";
import Website from "@/public/icons/Website_logo.svg";
import Link from "next/link";

const TokenCard: FC<TokenCardTypes> = ({
  name,
  cid,
  ticker,
  createdBy,
  description,
  rafflePrize,
  telegramUrl,
  websiteUrl,
  twitterUrl,
  bondingCurve,
}) => {
  return (
    <div
      className={`relative flex w-[400px] flex-col items-center justify-between rounded-lg border border-white border-opacity-50 bg-[#1C1C1C] p-[20px]`}
    >
      {bondingCurve === "100" && (
        <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-lg bg-[#000000b3] p-5">
          <img
            src="/icons/not-for-sale.svg"
            alt="Not for sale"
            className="scale-90"
          />
        </div>
      )}
      <div className="flex w-full justify-between">
        <div className="text-[14px] font-bold  text-white">
          {name} <div className="inline text-[#9F9FB1]">[ticker:{ticker}]</div>
        </div>
        <div className="flex items-center gap-4">
          {telegramUrl && (
            <Link href={"https://" + telegramUrl} className="cursor-pointer">
              <Telegram className="fill-[#5E5E5E] hover:fill-[#CFCFCF]" />
            </Link>
          )}
          {twitterUrl && (
            <Link href={"https://" + twitterUrl} className="cursor-pointer">
              <X className="fill-[#5E5E5E] hover:fill-[#CFCFCF]" />
            </Link>
          )}
          {websiteUrl && (
            <Link href={"https://" + websiteUrl} className="cursor-pointer">
              <Website className="fill-[#5E5E5E] hover:fill-[#CFCFCF]" />
            </Link>
          )}
        </div>
      </div>
      <div className="mt-[8px] flex gap-[20px]">
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className="h-[120px] w-[120px]"
        />
        <div className="h-[90px] w-[220px] text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
          <p className="h-[80px] overflow-scroll break-words text-[#6B6B6B]">
            {description}
          </p>
          <div className="mt-[10px] flex items-center gap-[5px]">
            <h1 className="text-xs text-white">Created by:</h1>
            <Image
              className="rounded-full"
              src="/icons/userIcon.svg"
              alt=""
              width={12}
              height={12}
              style={{ width: 12, height: 12 }}
            />
            <div className="text-xs text-white">
              {createdBy && createdBy.slice(0, 6) + "..."}
            </div>
          </div>
          <h1 className="text-white">prize: {rafflePrize}</h1>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
