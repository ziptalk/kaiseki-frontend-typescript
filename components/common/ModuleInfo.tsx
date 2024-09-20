import React from "react";
import { digital } from "@/fonts/font";
import { twMerge } from "tailwind-merge";
interface ModuleInfoProps {
  title: string;
  desc: string;
  className?: string;
  percentage?: number;
}

export const ModuleInfo = ({
  title,
  desc,
  className,
  percentage,
}: ModuleInfoProps) => {
  return (
    <div
      className={twMerge([
        "mr-[10px] flex h-[50px] w-[140px] flex-col justify-center rounded-[8px] bg-[#454545] px-[10px] py-[8px]",
        className,
      ])}
    >
      <div className="text-[13px] text-[#AEAEAE]">
        {title}
        {percentage !== undefined && (
          <p
            className={`${digital.variable} ml-[3px] inline font-digital text-[12px] text-secondary`}
          >
            {percentage < 0 ? `${percentage}%` : `+${percentage}%`}
          </p>
        )}
      </div>
      <div className="text-[14px] text-white">{desc}</div>
    </div>
  );
};
