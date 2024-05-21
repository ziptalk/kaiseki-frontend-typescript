import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface SocialLinkCardTypes {
  tw?: string;
  tg?: string;
  web?: string;
}

const SocialLinkCard: FC<SocialLinkCardTypes> = ({ tw, tg, web }) => {
  const [hovered, setHovered] = useState({ tw: false, tg: false, web: false });

  const handleMouseEnter = (link: string) => {
    setHovered((prev) => ({ ...prev, [link]: true }));
  };

  const handleMouseLeave = (link: string) => {
    setHovered((prev) => ({ ...prev, [link]: false }));
  };

  const handleClick = (url: string) => {
    if (url) {
      window.open(url);
    }
  };

  return (
    <div className="flex h-[125px] w-[276px] justify-center px-[30px] text-lg">
      <div className="flex h-full flex-col justify-between">
        {tw ? (
          <Image
            src={
              hovered.tw
                ? "/images/twitter_active_hovered.svg"
                : "/images/twitter_active_Default.svg"
            }
            alt="Twitter"
            width={100}
            height={100}
            className={`${tw && "fill-[#43FF4B]"}`}
            onMouseEnter={() => handleMouseEnter("tw")}
            onMouseLeave={() => handleMouseLeave("tw")}
            onClick={() => handleClick(tw)}
          />
        ) : (
          <Image
            src="/images/twitter_deactivated_Default.svg"
            alt="Twitter"
            width={100}
            height={100}
            className={`${tw && "fill-[#43FF4B]"}`}
          />
        )}

        {tg ? (
          <Image
            src={
              hovered.tg
                ? "/images/tg_active_hovered.svg"
                : "/images/tg_active_Default.svg"
            }
            alt="Telegram"
            width={120}
            height={120}
            className={``}
            onMouseEnter={() => handleMouseEnter("tg")}
            onMouseLeave={() => handleMouseLeave("tg")}
            onClick={() => handleClick(tg)}
          />
        ) : (
          <Image
            src="/images/tg_deactivated_Default.svg"
            alt="Telegram"
            width={120}
            height={120}
            className={`${tg && "fill-[#43FF4B]"}`}
          />
        )}

        {web ? (
          <Image
            src={
              hovered.web
                ? "/images/web_active_hovered.svg"
                : "/images/web_active_Default.svg"
            }
            alt="Website"
            width={110}
            height={110}
            className={``}
            onMouseEnter={() => handleMouseEnter("web")}
            onMouseLeave={() => handleMouseLeave("web")}
            onClick={() => handleClick(web)}
          />
        ) : (
          <Image
            src="/images/web_deactivated_Default.svg"
            alt="Website"
            width={110}
            height={110}
            className={``}
          />
        )}
      </div>
    </div>
  );
};

export default SocialLinkCard;
