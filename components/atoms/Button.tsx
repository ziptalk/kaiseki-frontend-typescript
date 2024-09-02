import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick?: (e: any) => void;
  className?: string;
}

export const Button = ({
  onClick,
  className,
  children,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={twMerge([
        "button-shadow flex h-[60px] w-full items-center justify-center rounded-[10px] bg-primary text-[16px] font-bold text-white",
        className,
      ])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
