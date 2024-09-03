import React from "react";
export const TokenDesc = ({
  name,
  ticker,
  createdBy,
  description,
}: TokenInfo) => {
  return (
    <div className="w-60">
      <h1 className="text-[15px] font-bold leading-none text-white">{name}</h1>
      <h1 className="text-[15px] font-bold leading-none text-white">
        [ticker: {ticker}]
      </h1>
      {createdBy && (
        <div className="mt-1 flex items-center gap-[5px]">
          <>
            <h1 className="neon-lime text-[12px] text-[#C5F900]">
              created by:{" "}
            </h1>
            <img
              className="rounded-full"
              src="/images/memesinoGhost.png"
              alt=""
              style={{ width: 12, height: 12 }}
            />
            <h1 className="neon-lime mt-[3px] text-[12px] text-[#C5F900]">
              {createdBy.length < 13
                ? createdBy
                : `${createdBy?.slice(0, 16)}...`}
            </h1>
          </>
        </div>
      )}
      <p className="mt-1 h-16 w-full overflow-scroll break-words text-[13px] text-[#808080]">
        {description}
      </p>
    </div>
  );
};
