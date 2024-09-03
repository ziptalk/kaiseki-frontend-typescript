"use client";

import React from "react";
import X from "@/public/icons/X_logo.svg";
import Telegram from "@/public/icons/telegram_logo.svg";
import Medium from "@/public/icons/medium_logo.svg";
import Github from "@/public/icons/github_logo.svg";

export const Footer = () => {
  return (
    <div className="mt-[214px] flex h-[134px] items-center justify-between px-40">
      <div className="whitespace-pre text-[14px] text-[#F2D1E4]">
        memeslot | contract@memeslot.io{"\n"}memeslot Labs Inc.All rights
        reserved
      </div>
      <div className="flex items-center gap-[12px]">
        <X className="cursor-pointer fill-[#F2D1E4] hover:fill-white" />
        <Telegram className="cursor-pointer fill-[#F2D1E4] hover:fill-white" />
        <Medium className="cursor-pointer fill-[#F2D1E4] hover:fill-white" />
        <Github className="cursor-pointer fill-[#F2D1E4] hover:fill-white" />
      </div>
    </div>
  );
};
