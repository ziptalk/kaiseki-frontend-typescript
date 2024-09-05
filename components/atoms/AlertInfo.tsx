import React from "react";
import Complete from "@/public/icons/complete.svg";
import Fail from "@/public/icons/fail.svg";
import { ModalRootWrapper } from "../common/Modal";

interface AlertInfoProps {
  buttonClicked: boolean;
  success: boolean;
}

export const AlertInfo = ({ buttonClicked, success }: AlertInfoProps) => {
  return (
    buttonClicked && (
      <ModalRootWrapper>
        <div
          className={`mt-52 flex h-9 items-center justify-center rounded-[7px] bg-[#4F4F4F] text-[16px] text-xs font-bold text-white md:h-[100px] md:w-[484px] md:rounded-[10px] ${buttonClicked ? "opacity-100" : "opacity-0"} mx-5 duration-1000 md:mx-auto`}
        >
          {success ? <Complete /> : <Fail />}
          <div className="ml-3">
            {success
              ? "Raffle has been successfully completed!"
              : "Raffle did not run properly. Please try again."}
          </div>
        </div>
      </ModalRootWrapper>
    )
  );
};
