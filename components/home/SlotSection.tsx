import { FC } from "react";
import Image from "next/image";

export const SlotSection: FC = () => {
  return (
    <div className="flex h-[140px] w-[390px] gap-[5px] rounded-lg border-4 border-[#A58C07] bg-black bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 p-[10px]">
      <div className="flex h-full w-[120px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white via-[#C0C0C0] to-white shadow-inner">
        <div className="h-[150px]">
          <Image src="/images/WIF.png" alt="" width={40} height={40} />
          <Image
            src="/images/catcat.png"
            alt=""
            width={40}
            height={40}
            className="my-[15px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] "
          />
          <Image src="/images/Seiyan.png" alt="" width={40} height={40} />
        </div>
      </div>
      <div className="flex h-full w-[120px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white via-[#C0C0C0] to-white shadow-inner">
        <div className="h-[150px]">
          <Image src="/images/Seiyan.png" alt="" width={40} height={40} />
          <Image
            src="/images/catcat.png"
            alt=""
            width={40}
            height={40}
            className="my-[15px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] "
          />
          <Image src="/images/WIF.png" alt="" width={40} height={40} />
        </div>
      </div>
      <div className="flex h-full w-[120px] flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white via-[#C0C0C0] to-white shadow-inner">
        <div className="h-[150px]">
          <Image src="/images/WIF.png" alt="" width={40} height={40} />
          <Image
            src="/images/catcat.png"
            alt=""
            width={40}
            height={40}
            className="my-[15px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525] "
          />
          <Image src="/images/Seiyan.png" alt="" width={40} height={40} />
        </div>
      </div>
    </div>
  );
};
