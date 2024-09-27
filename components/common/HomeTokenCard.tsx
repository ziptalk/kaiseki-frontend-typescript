import { FC, useEffect, useState } from "react";
import { TokenDesc } from "../common/TokenDesc";
import BondingCurveCard from "../detail/BondingCurveCard";
import { setCurStepsIntoState } from "@/utils/getCurve";
// import Link from "next/link";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
export const MyPageTokenCard: FC<TokenCardTypes> = ({
  name,
  ticker,
  description,
  tokenAddress,
  rafflePrize,
  cid,
  setModal,
}) => {
  const router = useRouter();
  const [curve, setCurve] = useState(0);
  const [width, setWidth] = useState(250);

  const getCurve = async () => {
    await setCurStepsIntoState({ tokenAddress }).then((res) => {
      setCurve(res?.curve || 0);
    });
  };
  useEffect(() => {
    getCurve();
  }, [tokenAddress]);

  useEffect(() => {
    setWidth(window.innerWidth);
    const updateWindowDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateWindowDimensions);
    return () => window.removeEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <div
      className={`w-full cursor-pointer bg-[#252525] md:hover:bg-[#2C2C2C]`}
      onMouseDown={() => {
        width > 768 && setModal && setModal(false);
        width > 768 && router.push(`/${tokenAddress}`);
      }}
    >
      <div className={`flex h-20 gap-[10px]`}>
        <img
          src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
          alt="Image from IPFS"
          className={`h-[80px] w-[80px] border-black`}
        />
        <div className={`text h-full w-full overflow-hidden px-[10px]`}>
          <TokenDesc
            {...{
              cid,
              description,
              // marketCap,
              rafflePrize,
              name,
              ticker,
              tokenAddress,
            }}
          />
        </div>
      </div>
      <div className="mt-4 w-full">
        <BondingCurveCard prog={Math.floor(curve)} bgColor="[#454545]" my />
      </div>
    </div>
  );
};
