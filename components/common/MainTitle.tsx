import React from "react";
import { anton } from "@/fonts/font";

export const MainTitle = ({ title }: { title: string }) => {
  return (
    <div className="rounded-[5px] bg-gradient-to-t from-yellow-300 to-white p-[2px]">
      <div className="flex h-[60px] w-[390px] items-center justify-center rounded-[5px] bg-gradient-to-t from-[#670C0C] to-[#191919]">
        <div className={`title-typo ${anton.variable} absolute`}>{title}</div>
        <div className={`title-shadow ${anton.variable}`}>{title}</div>
      </div>
    </div>
  );
};
