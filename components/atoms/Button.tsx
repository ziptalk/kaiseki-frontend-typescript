import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick?: () => void;
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
        "bg-primary button-shadow h-[60px] w-full rounded-[10px] text-[16px] font-bold text-white",
        className,
      ])}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
