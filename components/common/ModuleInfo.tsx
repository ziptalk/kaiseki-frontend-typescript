import React from "react";
import { digital } from "@/fonts/font";
interface ModuleInfoProps {
  title: string;
  desc: string;
  percentage?: string;
}

export const ModuleInfo = ({ title, desc, percentage }: ModuleInfoProps) => {
  return (
    <div className="mr-[10px] flex h-[50px] w-[140px] flex-col justify-center rounded-[8px] bg-[#454545] px-[10px] py-[8px]">
      <div className="text-[13px] text-[#AEAEAE]">
        {title}
        <p
          className={`${digital.variable} neon-yellow ml-[3px] inline font-digital text-[12px]`}
        >
          {percentage}
        </p>
      </div>
      <div className="text-[14px] text-white">{desc}</div>
    </div>
  );
};
