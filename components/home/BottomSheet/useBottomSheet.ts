import { useRef, useEffect } from "react";
import { MIN_Y, MAX_Y, BOTTOM_SHEET_HEIGHT } from "./BottomSheetOption";

interface BottomSheetMetrics {
  touchStart: {
    sheetY: number;
    touchY: number;
  };
  touchMove: {
    prevTouchY?: number;
    movingDirection: "none" | "down" | "up";
  };
  isContentAreaTouched: boolean;
}

export default function useBottomSheet({
  setUnVisible,
}: {
  setUnVisible: () => void;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  const metrics = useRef<BottomSheetMetrics>({
    touchStart: {
      sheetY: 0,
      touchY: 0,
    },
    touchMove: {
      prevTouchY: 0,
      movingDirection: "none",
    },
    isContentAreaTouched: false,
  });

  // useEffect(() => {
  //   const canUserMoveBottomSheet = () => {
  //     const { touchMove, isContentAreaTouched } = metrics.current;

  //     if (!isContentAreaTouched) {
  //       return true;
  //     }

  //     if (sheet.current!.getBoundingClientRect().y !== MIN_Y) {
  //       return true;
  //     }

  //     if (touchMove.movingDirection === "down") {
  //       return content.current!.scrollTop <= 0;
  //     }
  //     return false;
  //   };

  //   const handleTouchStart = (e: TouchEvent) => {
  //     const { touchStart } = metrics.current;
  //     touchStart.sheetY = sheet.current!.getBoundingClientRect().y;
  //     touchStart.touchY = e.touches[0].clientY;
  //   };

  //   const handleTouchMove = (e: TouchEvent) => {
  //     const { touchStart, touchMove } = metrics.current;
  //     const currentTouch = e.touches[0];

  //     if (touchMove.prevTouchY === undefined) {
  //       touchMove.prevTouchY = touchStart.touchY;
  //     }

  //     if (touchMove.prevTouchY === 0) {
  //       touchMove.prevTouchY = touchStart.touchY;
  //     }

  //     if (touchMove.prevTouchY < currentTouch.clientY) {
  //       touchMove.movingDirection = "down";
  //     }

  //     if (touchMove.prevTouchY > currentTouch.clientY) {
  //       touchMove.movingDirection = "up";
  //     }

  //     if (canUserMoveBottomSheet()) {
  //       e.preventDefault();

  //       const touchOffset = currentTouch.clientY - touchStart.touchY;
  //       let nextSheetY = touchStart.sheetY + touchOffset;

  //       if (nextSheetY <= MIN_Y) {
  //         nextSheetY = MIN_Y;
  //       }

  //       if (nextSheetY >= MAX_Y) {
  //         nextSheetY = MAX_Y;
  //       }

  //       sheet.current!.style.setProperty(
  //         "transform",
  //         `translateY(${nextSheetY}px)`,
  //       );
  //     } else {
  //       document.body.style.overflowY = "hidden";
  //     }
  //   };

  //   const handleTouchEnd = (e: TouchEvent) => {
  //     document.body.style.overflowY = "auto";
  //     const { touchMove } = metrics.current;
  //     if (sheet.current === null) return;

  //     const currentSheetY = sheet.current!.getBoundingClientRect().y;

  //     if (currentSheetY > 250) {
  //       if (touchMove.movingDirection === "down") {
  //         setUnVisible();
  //       }
  //     } else {
  //       sheet.current!.style.setProperty("transform", "translateY(0)");
  //     }

  //     metrics.current = {
  //       touchStart: {
  //         sheetY: 0,
  //         touchY: 0,
  //       },
  //       touchMove: {
  //         prevTouchY: 0,
  //         movingDirection: "none",
  //       },
  //       isContentAreaTouched: false,
  //     };
  //   };

  //   sheet.current!.addEventListener("touchstart", handleTouchStart);
  //   sheet.current!.addEventListener("touchmove", handleTouchMove);
  //   sheet.current!.addEventListener("touchend", handleTouchEnd);
  // }, []);

  // useEffect(() => {
  //   const handleTouchStart = () => {
  //     metrics.current!.isContentAreaTouched = true;
  //   };
  //   content.current!.addEventListener("touchstart", handleTouchStart);
  // }, []);

  return { sheet, content };
}
