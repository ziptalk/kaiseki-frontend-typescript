"use client";

import React from "react";
import X from "@/public/icons/X_logo.svg";
import Telegram from "@/public/icons/telegram_logo.svg";
import Medium from "@/public/icons/medium_logo.svg";
import Github from "@/public/icons/github_logo.svg";

export const Footer = () => {
  return (
    <div className="mt-24 flex items-center justify-between px-5 pb-2 md:mt-[214px] md:flex md:h-[134px] md:px-40">
      <div className="whitespace-pre text-sm text-[#AEAEAE]">
        RWE | contract@rwe.io{"\n"}RWE Inc.All rights reserved
      </div>
      <div className="flex items-center gap-[12px]">
        {/* <X className="cursor-pointer fill-[#F2D1E4] hover:fill-white" />
        <Telegram className="cursor-pointer fill-[#F2D1E4] hover:fill-white" />
        <Medium className="cursor-pointer fill-[#F2D1E4] hover:fill-white" />
        <Github className="cursor-pointer fill-[#F2D1E4] hover:fill-white" /> */}
      </div>
    </div>
  );
};
