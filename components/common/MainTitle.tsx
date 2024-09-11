import React from "react";
import { anton } from "@/fonts/font";

export const MainTitle = ({ title }: { title: string }) => {
  return (
    <div className="w-full rounded-[5px] bg-gradient-to-t from-yellow-300 to-white p-[2px]">
      <div className="flex items-center justify-center rounded-[5px] bg-gradient-to-t from-[#670C0C] to-[#191919] py-2">
        <div
          className={`title-typo ${anton.variable} absolute text-2xl md:text-3xl`}
        >
          {title}
        </div>
        <div className={`title-shadow ${anton.variable} text-2xl md:text-3xl`}>
          {title}
        </div>
      </div>
    </div>
  );
};
