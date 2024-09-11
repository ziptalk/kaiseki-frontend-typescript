import React from "react";
import Complete from "@/public/icons/complete.svg";
import Fail from "@/public/icons/fail.svg";
import { ModalRootWrapperAllert } from "../common/Modal";

interface AlertInfoProps {
  buttonClicked: boolean;
  success: boolean;
  successMessage?: string;
  failMessage?: string;
}

export const AlertInfo = ({
  buttonClicked,
  success,
  successMessage,
  failMessage,
}: AlertInfoProps) => {
  return (
    buttonClicked && (
      <ModalRootWrapperAllert>
        <div
          className={`mx-auto inline-block h-9 items-center justify-center rounded-[7px] bg-[#4F4F4F] p-5 text-xs font-bold text-white md:mt-52 md:h-[100px] md:rounded-[10px] md:text-[18px]`}
        >
          <div className="flex h-full w-full items-center justify-center">
            {success ? <Complete /> : <Fail />}
            <div className="ml-3">
              {success
                ? successMessage || "Raffle has been successfully completed!"
                : failMessage ||
                  "Raffle did not run properly. Please try again."}
            </div>
          </div>
        </div>
      </ModalRootWrapperAllert>
    )
  );
};
