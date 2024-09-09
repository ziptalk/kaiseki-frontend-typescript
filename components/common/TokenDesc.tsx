import React, { useEffect, useState } from "react";
export const TokenDesc = ({
  name,
  ticker,
  createdBy,
  description,
}: TokenInfo) => {
  // const width = window && window.innerWidth;
  // const isMobile = width < 768;
  const [width, setWidth] = useState(180);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWindowDimensions);

    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);
  return (
    <div style={{ width: width < 768 ? width - 180 : 240 }}>
      <h1 className="truncate break-words text-[15px] font-bold leading-none text-white">
        {name}
      </h1>
      <h1 className="text-[15px] font-bold leading-none text-white">
        [ticker: {ticker}]
      </h1>
      {createdBy && (
        <div className="mt-1 flex items-center gap-[5px]">
          <h1 className="neon-lime text-nowrap text-[12px] text-[#C5F900]">
            created by:{" "}
          </h1>
          <img
            className="rounded-full"
            src="/images/memesinoGhost.png"
            alt=""
            style={{ width: 12, height: 12 }}
          />
          <h1 className="neon-lime mt-[3px] truncate text-[12px] text-[#C5F900]">
            {createdBy}
          </h1>
        </div>
      )}
      <p className="mt-1 h-14 overflow-scroll break-words text-[13px] text-[#808080] md:h-full md:w-full">
        {description}
      </p>
    </div>
  );
};
