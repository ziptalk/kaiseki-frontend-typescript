import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import Arrow from "@/public/icons/pagePre.svg";

interface PageLinkButtonProps {
  href: string;
  className?: string;
  prev?: boolean;
}

export const PageLinkButton = ({
  href,
  prev,
  className,
  children,
}: PropsWithChildren<PageLinkButtonProps>) => {
  return (
    <Link
      href={href}
      className={twMerge([
        "my-2 flex w-28 cursor-pointer items-center justify-center text-xs leading-3 text-[#AEAEAE] md:h-[24px] md:w-[114px] md:text-[16px]",
        prev ? "mr-auto" : "ml-auto",
        className,
      ])}
    >
      {prev && <Arrow fill="#AEAEAE" className="mr-[8px]" />}
      {children}
      {prev || (
        <Arrow fill="#AEAEAE" className="translate ml-[8px] rotate-180" />
      )}
    </Link>
  );
};
