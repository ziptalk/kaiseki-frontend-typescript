import React from "react";
import { anton } from "@/fonts/font";

export const MainTitle = ({
  title,
  fail = false,
}: {
  title: string;
  fail?: boolean;
}) => {
  return (
    <div className="w-full rounded-[5px] bg-[#181818] shadow-[inset_0px_4px_8px_0px_rgba(0,0,0,0.25)] outline outline-2 outline-offset-[-2px] outline-white ">
      <div className="relative flex items-center justify-center rounded-[5px] py-3.5">
        {fail ? (
          <>
            <div
              className={`title-fail ${anton.variable} absolute text-2xl md:text-3xl`}
            >
              {title}
            </div>
            <div
              className={`title-shadow ${anton.variable} text-2xl md:text-3xl`}
            >
              {title}
            </div>
          </>
        ) : (
          <>
            <img src="/images/raffle-is-ready.png" alt="Logo" />
          </>
        )}
      </div>
    </div>
  );
};
