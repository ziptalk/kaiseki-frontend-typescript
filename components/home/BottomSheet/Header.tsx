import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  z-index: 102;
  height: 24px;
  border-top-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: relative;
  padding-top: 12px;
  padding-bottom: 4px;
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: #dee2e6;
  margin: auto;
`;
const Header = ({ ref }: any) => {
  return (
    <Wrapper ref={ref}>
      <Handle />
    </Wrapper>
  );
};

export default Header;
