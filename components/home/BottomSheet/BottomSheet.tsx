import React, { PropsWithChildren } from "react";
import { BOTTOM_SHEET_HEIGHT } from "./BottomSheetOption";
import styled from "styled-components";
import { motion } from "framer-motion";
import useBottomSheet from "./useBottomSheet";
import Header from "./Header";

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;

  position: fixed;
  top: 57px;
  left: 0;
  right: 0;
  /* width: 100%; */
  z-index: 100;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  height: ${BOTTOM_SHEET_HEIGHT}px;
  background: #252525;
  transition: transform 200ms ease-out; /*바텀시트 애니메이션 속도*/
`;

const BottomSheetContent = styled.div`
  overflow: auto;
  -webkit-overflow-scrolling: touch;
`;

interface BottomSheetProps {
  visible: boolean;
  setUnVisible: () => void;
}

function BottomSheet({
  children,
  visible,
  setUnVisible,
}: PropsWithChildren<BottomSheetProps>) {
  const { sheet, content } = useBottomSheet({ setUnVisible });

  return (
    <>
      <div
        className="fixed left-0 top-0 z-[100] h-[100vh] w-[100vw] bg-[#00000050]"
        onClick={setUnVisible}
      />
      {visible && (
        <Wrapper ref={sheet}>
          {/* <Header /> */}
          <BottomSheetContent ref={content}>{children}</BottomSheetContent>
        </Wrapper>
      )}
    </>
  );
}

export default BottomSheet;
