import styled from "styled-components";

export const ModalRootWrapper = styled.div`
  position: fixed; // 포지션 픽스, 화면이 스크롤되더라도 고정되기 위함
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100vw;
  background-color: rgba(0, 0, 0, 0.7);
  height: 100vh;
  z-index: 20;
`;

export const ModalContentBox = styled.div`
  width: 600px;
  padding: 25px 60px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 34px;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  border-radius: 10px;
  border: 1.5px solid #b9b9b9;
  background: #1e1e1e;
  text-align: center;
  color: white;
  /* z-index: 1000; */
`;
