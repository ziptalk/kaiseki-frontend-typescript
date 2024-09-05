import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  onClick?: (e: any) => void;
  className?: string;
  variant?: "default" | "gradiant";
  submit?: boolean;
}

export const Button = ({
  onClick,
  className,
  children,
  variant = "default",
  submit = false,
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      className={twMerge([
        "flex h-[60px] w-full items-center justify-center rounded-[10px] text-[16px] font-bold text-white",
        variant === "gradiant"
          ? "button-shadow button-bg-primary"
          : "bg-[#950000]",
        className,
      ])}
      onClick={onClick}
      type={submit ? "submit" : undefined}
    >
      {children}
    </button>
  );
};
