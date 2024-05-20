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
      <div className="flex h-[125px] w-[276px] justify-center px-[30px] text-lg">
        <div className="flex h-full  flex-col justify-between">
          <Link href={tw ? tw : ""}>
            {tw ? (
              <Image
                src="/images/twitter_active_Default.svg"
                alt=""
                width={100}
                height={100}
                className={`  ${tw && "fill-[#43FF4B]"}`}
              />
            ) : (
              <Image
                src="/images/twitter_deactivated_Default.svg"
                alt=""
                width={100}
                height={500}
                className={`  ${tw && "fill-[#43FF4B]"}`}
              />
            )}
          </Link>
          <Link href={tg ? tg : ""}>
            {tg ? (
              <Image
                src="/images/tg_active_Default.svg"
                alt=""
                width={120}
                height={120}
                className={` `}
              />
            ) : (
              <Image
                src="/images/tg_deactivated_Default.svg"
                alt=""
                width={120}
                height={120}
                className={` ${tw && "fill-[#43FF4B]"}`}
              />
            )}
          </Link>
          <Link href={web ? web : ""}>
            {web ? (
              <Image
                src="/images/web_active_Default.svg"
                alt=""
                width={110}
                height={110}
                className={` `}
              />
            ) : (
              <Image
                src="/images/web_deactivated_Default.svg"
                alt=""
                width={110}
                height={110}
                className={` `}
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default SocialLinkCard;
