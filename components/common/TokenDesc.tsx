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
      <h1 className="truncate whitespace-pre break-words text-[15px] font-bold leading-5 text-[#AEAEAE]">
        {name}
        {"\n"}
        [ticker: {ticker}]
      </h1>
      {createdBy && (
        <div className=" flex items-center gap-[5px] text-sm text-[#C5F900]">
          <h1 className="text-nowrap ">created by: </h1>
          <img
            className="rounded-full"
            src="/images/memesinoGhost.png"
            alt=""
            style={{ width: 12, height: 12 }}
          />
          <h1 className="truncate">{createdBy}</h1>
        </div>
      )}
      <p className="h-14 overflow-scroll break-words text-[14px] text-[#CFCFCF] md:h-full md:w-full">
        {description}
      </p>
    </div>
  );
};
