"use client";

import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Detail() {
  const pathname = usePathname();
  return (
    <>
      <Header />

      <main className="h-screen w-screen flex bg-gradient-to-br from-[#1F1F1F] to-[#220A09]">
        <div className="w-[50vw] h-full bg-blue-100 mx-auto pt-10 ">
          <div className="w-full h-[300px] bg-red-100  flex justify-between px-10">
            <div className="h-full flex flex-col justify-between">
              <div className="bg-green-100 w-[500px] h-[200px] border rounded-3xl"></div>
              <div className="w-[500px] h-12 bg-green-100 flex justify-between">
                <input className="w-[70%] h-full bg-gray-100"></input>
                <button className="w-[20%] h-full bg-gray-100"></button>
              </div>
            </div>
            <div className="h-[300px] w-[200px] bg-violet-100"></div>
          </div>

          <div className="w-full h-[100px] bg-red-100 mt-10 px-10">
            <div className="bg-green-100 h-full w-[500px]">{pathname}</div>
          </div>

          <div className="bg-red-100 w-full h-[800px] mt-10 rounded-3xl grid-cols-3 grid-rows-4 grid p-8">
            <div className="bg-green-100 w-[250px] h-[150px] rounded-3xl"></div>
            <div className="bg-green-100 w-[250px] h-[150px] rounded-3xl"></div>
            <div className="bg-green-100 w-[250px] h-[150px] rounded-3xl"></div>
            <div className="bg-green-100 w-[250px] h-[150px] rounded-3xl"></div>
          </div>
        </div>
      </main>
    </>
  );
}
