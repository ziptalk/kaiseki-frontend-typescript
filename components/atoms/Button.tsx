import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick?: (e: any) => void;
  className?: string;
  variant?: "default" | "gradiant";
  submit?: boolean;
  off?: boolean;
}

export const Button = ({
  onClick,
  className,
  children,
  variant = "default",
  submit = false,
  off = false,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={twMerge([
        "flex h-9 w-full items-center justify-center rounded-[6px] text-sm font-bold text-white md:h-[50px] md:rounded-[10px] md:text-[16px]",
        variant === "gradiant"
          ? "button-shadow"
          : off
            ? "bg-[#303030] hover:bg-[#454545]"
            : "hover:buttonhover bg-[#950000]",
        className,
      ])}
      onClick={onClick}
      type={submit ? "submit" : undefined}
    >
      {children}
    </button>
  );
};
