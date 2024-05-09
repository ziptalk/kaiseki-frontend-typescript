"use client";

import Header from "@/components/Header";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex h-screen w-screen bg-gradient-to-br from-[#1F1F1F] to-[#220A09]">
        <div className="mx-auto h-full w-[50vw] bg-blue-100 pt-10 ">
          <div className="flex h-[300px] w-full  justify-between bg-red-100 px-10">
            <div className="flex h-full flex-col justify-between">
              <div className="h-[200px] w-[500px] rounded-3xl border bg-green-100"></div>
              <div className="flex h-12 w-[500px] justify-between bg-green-100">
                <input className="h-full w-[70%] bg-gray-100"></input>
                <button className="h-full w-[20%] bg-gray-100"></button>
              </div>
            </div>
            <div className="h-[300px] w-[200px] bg-violet-100"></div>
          </div>

          <div className="mt-10 h-[100px] w-full bg-red-100 px-10">
            <div className="h-full w-[500px] bg-green-100"></div>
          </div>

          <div className="mt-10 grid h-[800px] w-full grid-cols-3 grid-rows-4 rounded-3xl bg-red-100 p-8">
            <div className="h-[150px] w-[250px] rounded-3xl bg-green-100"></div>
            <div className="h-[150px] w-[250px] rounded-3xl bg-green-100"></div>
            <div className="h-[150px] w-[250px] rounded-3xl bg-green-100"></div>
            <div className="h-[150px] w-[250px] rounded-3xl bg-green-100"></div>
          </div>
        </div>
      </main>
    </>
  );
}
