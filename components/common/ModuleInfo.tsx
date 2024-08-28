import React from "react";

interface ModuleInfoProps {
  title: string;
  desc: string;
  percentage?: string;
}

export const ModuleInfo = ({ title, desc, percentage }: ModuleInfoProps) => {
  return (
    <div className="flex w-[135px] flex-col gap-[10px] rounded-[8px] bg-[#0FF] px-[10px] py-[8px]">
      <div className="text-[14px]">
        {title}
        <p className="ml-[3px] inline text-[12px] text-[#0038FF]">
          {percentage}
        </p>
      </div>
      <div className="text-[14px]">{desc}</div>
    </div>
  );
};
