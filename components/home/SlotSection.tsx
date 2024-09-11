import { FC, useEffect, useState } from "react";
import Image from "next/image";

export const SlotSection = ({ cid }: { cid: string }) => {
  const cidImg = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`;
  const images1 = [
    { src: "/dump/WIF.png", alt: "Dog" },
    { src: cidImg, alt: "RWA" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
    { src: "/dump/WIF.png", alt: "Dog" },
    { src: cidImg, alt: "RWA" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
    { src: "/dump/catcat.png", alt: "Cat" },
  ];
  const images2 = [
    { src: cidImg, alt: "RWA" },
    { src: "/dump/catcat.png", alt: "Cat" },
    { src: "/icons/logo_icon.svg", alt: "logo" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
    { src: "/dump/catcat.png", alt: "Cat" },
    { src: "/icons/logo_icon.svg", alt: "logo" },
    { src: cidImg, alt: "RWA" },
    { src: "/dump/catcat.png", alt: "Cat" },
    { src: "/icons/logo_icon.svg", alt: "logo" },
    { src: cidImg, alt: "RWA" },
    { src: "/dump/catcat.png", alt: "Cat" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
  ];
  const images3 = [
    { src: "/dump/WIF.png", alt: "Dog" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
    { src: cidImg, alt: "RWA" },
    { src: "/dump/WIF.png", alt: "Dog" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
    { src: "/dump/catcat.png", alt: "Cat" },
    { src: "/icons/logo_icon.svg", alt: "logo" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
    { src: cidImg, alt: "RWA" },
    { src: "/dump/catcat.png", alt: "Cat" },
    { src: "/dump/Seiyan.png", alt: "Dragon" },
    { src: cidImg, alt: "RWA" },
    { src: "/dump/WIF.png", alt: "Dog" },
    { src: "/dump/catcat.png", alt: "Cat" },
  ];

  const [isSpinning, setIsSpinning] = useState([true, true, true]);

  useEffect(() => {
    const stopTimers = [
      setTimeout(() => stopSlot(0), 1150),
      setTimeout(() => stopSlot(1), 3100),
      setTimeout(() => stopSlot(2), 3900),
    ];
    return () => stopTimers.forEach((timer) => clearTimeout(timer));
  }, [cid]);

  // useEffect(() => {
  //   if (
  //     isSpinning[0] === false &&
  //     isSpinning[1] === false &&
  //     isSpinning[2] === false
  //   ) {
  //     setTimeout(() => {
  //       setIsSpinning([true, true, true]);
  //     }, 1000);
  //   }
  // }, [isSpinning]);

  const stopSlot = (slotIndex: number) => {
    setIsSpinning((prevState) => {
      const newState = [...prevState];
      newState[slotIndex] = false;
      return newState;
    });
  };

  return (
    <div className="flex h-28 w-full gap-[5px] rounded-lg border-4 border-[#A58C07] bg-black bg-gradient-to-b from-neutral-600 via-neutral-800 to-neutral-600 p-[10px] md:h-[140px]">
      <SlotColumn images={images1} isSpinning={isSpinning[0]} idx={1} />
      <SlotColumn images={images2} isSpinning={isSpinning[1]} idx={6} />
      <SlotColumn images={images3} isSpinning={isSpinning[2]} idx={11} />
    </div>
  );
};

const SlotColumn: FC<{
  images: { src: string; alt: string }[];
  isSpinning: boolean;
  idx: number;
}> = ({ images, isSpinning, idx }) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white via-[#C0C0C0] to-white shadow-inner">
      <div
        className={`slot-container ${isSpinning ? "spinning" : "stopped"} ${
          isSpinning || idx === 1
            ? "top-[-38px]"
            : idx === 6
              ? "top-[-318px]"
              : "top-[-597px]"
        }`}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={40}
            height={40}
            className={`slot-image mt-4 ${
              !isSpinning && index === idx ? "active" : ""
            }`}
          />
        ))}
      </div>
      <style jsx>{`
        .slot-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          position: relative;
        }

        .spinning {
          animation: spin 7s linear forwards;
        }

        .stopped {
          animation: none;
        }

        .slot-image {
          margin: 10px 0;
        }

        @keyframes spin {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-1000px);
          }
        }
      `}</style>
    </div>
  );
};
