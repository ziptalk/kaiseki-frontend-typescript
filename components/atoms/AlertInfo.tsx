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
          className={`mx-auto mt-52 flex h-[100px] w-[484px] items-center justify-center rounded-[10px] bg-[#4F4F4F] text-[16px] font-bold text-white ${buttonClicked ? "opacity-100" : "opacity-0"} duration-1000`}
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
