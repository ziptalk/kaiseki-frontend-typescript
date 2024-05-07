"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FC } from "react";

const Header: FC = () => {
  return (
    <>
      <header className="h-[10vh] w-screen bg-red-100 flex sticky top-0 left-0">
        <div className="flex justify-between w-full h-full px-5">
          <div className="flex px-2 h-full items-center ">
            <div className="flex border items-center border-r-black px-2 h-[50%]">
              <div className="border ">logo</div>
              <div className="border ml-5">name</div>
            </div>
            <div className="flex items-center ">
              <h1 className="border ml-5">menu</h1>
              <h1 className="border ml-5">menu</h1>
              <h1 className="border ml-5">menu</h1>
            </div>
          </div>
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
