import React from "react";
import Complete from "@/public/icons/complete.svg";
import Fail from "@/public/icons/fail.svg";

interface AlertInfoProps {
  buttonClicked: boolean;
  success: boolean;
}

export const AlertInfo = ({ buttonClicked, success }: AlertInfoProps) => {
  return (
    <div
      className={`mx-auto mt-[61px] flex h-[100px] w-[484px] items-center justify-center rounded-[10px] bg-[#4F4F4F80] text-[16px] font-bold text-white ${buttonClicked ? "opacity-100" : "opacity-0"} duration-500`}
    >
      {success ? <Complete /> : <Fail />}
      {success
        ? "Raffle has been successfully completed!"
        : "Raffle did not run properly. Please try again."}
    </div>
  );
};
