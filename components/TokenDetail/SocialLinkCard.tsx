import Image from "next/image";
import Link from "next/link";

import { FC } from "react";
interface SocialLinkCardTypes {
  tw?: string;
  tg?: string;
  web?: string;
}

const SocialLinkCard: FC<SocialLinkCardTypes> = ({ tw, tg, web }) => {
  return (
    <>
      <div className="flex h-[125px]  w-[20%] flex-col justify-between px-[30px] text-lg">
        <Link href={tw ? tw : ""}>
          <h1
            className={`${tw && "text-[#43FF4B]"} flex h-full items-center gap-[8px]`}
          >
            <Image
              src="/icons/X_logo.svg"
              alt=""
              width={50}
              height={50}
              className={`h-full w-[15px] ${tw && "fill-[#43FF4B]"}`}
            />{" "}
            [twitter]
          </h1>
        </Link>
        <Link href={tg ? tg : ""}>
          <h1
            className={`${tw && "text-[#00FFF0]"} flex h-full items-center gap-[8px]`}
          >
            <Image
              src="/icons/telegram_logo.svg"
              alt=""
              width={50}
              height={50}
              className="h-full w-[15px]"
            />{" "}
            [telegram]
          </h1>
        </Link>
        <Link href={web ? web : ""}>
          <h1
            className={`${tw && "text-[#FB30FF]"} flex h-full items-center gap-[8px]`}
          >
            <Image
              src="/icons/telegram_logo.svg"
              alt=""
              width={50}
              height={50}
              className="h-full w-[15px]"
            />{" "}
            [website]
          </h1>
        </Link>
      </div>
    </>
  );
};

export default SocialLinkCard;
