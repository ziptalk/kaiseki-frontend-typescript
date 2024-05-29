"use client";

import { NextPage } from "next";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import { abi } from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import { useEthersProvider } from "@/config";
import contracts from "@/contracts/contracts";
import { digital, impact } from "@/fonts/font";
import { Contract } from "ethers";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  useAccount,
  useChainId,
  useConnect,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { useEthersSigner } from "@/hooks/ethersSigner";
import { ModalContentBox, ModalRootWrapper } from "@/components/Common/Modal";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import reserveTokenABI from "@/abis/ReserveToken/ReserveToken.json";

const Create: NextPage = () => {
  const { ethers } = require("ethers");
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const account = useAccount();
  const contract = new Contract(contracts.MCV2_Bond, abi, provider);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [buyValue, setBuyValue] = useState("");
  const [modalToggle, setModalToggle] = useState(true);
  const router = useRouter();
  const MAX_INT_256: BigInt = BigInt(2) ** BigInt(256) - BigInt(2);

  const wei = (num: number, decimals = 18): bigint => {
    return BigInt(num) * BigInt(10) ** BigInt(decimals);
  };

  const { abi: MCV2_BondABI } = MCV2_BondArtifact;

  const bondWriteContract = new ethers.Contract(
    contracts.MCV2_Bond,
    MCV2_BondABI,
    signer,
  );

  // 이벤트 이거 가져와짐 개꿀

  const fetchEvent = async () => {
    try {
      const filter = contract.filters.TokenCreated();
      const events = await contract.queryFilter(filter, -1000);

      if (events.length > 0) {
        for (const log of events) {
          const event = contract.interface.decodeEventLog(
            "TokenCreated",
            log.data,
            log.topics,
          );
          if (event[1] === name) {
            console.log("REAL TOKEN ADDR: " + event[0]);
            return event[0];
          }
        }
      } else {
        console.log("No events found");
      }
    } catch (error) {
      console.error("Error querying filter:", error);
    }
    return null;
  };

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [cid, setCid] = useState("");

  const uploadFile = async (fileToUpload: File) => {
    try {
      setIsLoading(true);
      const data = new FormData();
      data.set("file", fileToUpload);
      const res = await fetch("/api/pinata", {
        method: "POST",
        body: data,
      });
      const resData = await res.json();
      setCid(resData.IpfsHash);
      setIsModalVisible(true);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      alert("Trouble uploading file");
    }
  };

  const sendCidAndTokenAddressToServer = async (
    createdTokenAddress: any,
    cid: any,
  ) => {
    try {
      const response = await fetch(
        "https://memesino.fun/storeCidAndTokenAddress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cid,
            name: name,
            ticker: ticker,
            tokenAddress: createdTokenAddress,
            description: desc,
            twitterUrl: tw,
            telegramUrl: tg,
            websiteUrl: web,
            marketCap: 0,
            createdBy: account.address,
          }),
        },
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  // MARK: - Submit

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get("name") as string;
      const ticker = formData.get("ticker") as string;

      // Checking chain id valid and change chain if not
      if (chainId != 713715) {
        switchChain({ chainId: 713715 });
      }
      if (account.status === "disconnected") {
        alert("Connect your wallet first!");
        return;
      } else if (name == "" || ticker == "") {
        alert("Invalid input value!");
        return;
      } else if (name.length > 30) {
        alert("Invalid name length!");
        return;
      } else if (ticker.length > 10) {
        alert("Invalid Ticker length!");
        return;
      } else if (desc.length > 100) {
        alert("Invalid name length!");
        return;
      } else if (!cid) {
        alert("Invalid input value!");
        return;
      } else if (isLoading) {
        return;
      }
      setIsLoading(true);
      const receipt = await bondWriteContract.createToken(
        { name: name, symbol: ticker },
        {
          mintRoyalty: 10,
          burnRoyalty: 10,
          reserveToken: contracts.ReserveToken,
          maxSupply: wei(10000000), // supply: 10M
          stepRanges: [
            wei(10000),
            wei(100000),
            wei(200000),
            wei(500000),
            wei(1000000),
            wei(2000000),
            wei(5000000),
            wei(10000000),
          ],
          stepPrices: [
            wei(0, 9),
            wei(2, 9),
            wei(3, 9),
            wei(4, 9),
            wei(5, 9),
            wei(7, 9),
            wei(10, 9),
            wei(15, 9),
          ],
        },
      );
      console.log(receipt);

      const createdTokenAddress = await fetchEvent();
      setcreatedTokenAddress(createdTokenAddress);
      console.log(cid);
      console.log(createdTokenAddress);
      await sendCidAndTokenAddressToServer(createdTokenAddress, cid);
      setIsLoading(false);

      afterMint(createdTokenAddress);
    } catch (error) {
      console.error("Error while minting:", error);
      setIsLoading(false);
    }
  }

  const [createdTokenAddress, setcreatedTokenAddress] = useState("");

  const afterMint = async (createdTokenAddress: string) => {
    // await getNextMintPrice(createdTokenAddress);
    // setIsModalVisible(true);
    router.push(`/${createdTokenAddress}`);
  };

  const reserveTokenWriteContract = new ethers.Contract(
    contracts.ReserveToken,
    reserveTokenABI,
    signer,
  );

  //MARK:- Modal Buy

  const [txState, setTxState] = useState("idle");

  // async function modalBuy(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   if (!account.address) {
  //     alert("Connect your wallet first!");
  //     throw new Error("Account is not defined");
  //   }
  //   if (chainId != 713715) {
  //     switchChain({ chainId: 713715 });
  //   }
  //   console.log("start-app");
  //   try {
  //     const allowance = await reserveTokenWriteContract.allowance(
  //       account.address,
  //       contracts.MCV2_Bond,
  //     );
  //     if (BigInt(allowance) < BigInt(wei(Number(inputValue)))) {
  //       console.log("Approving token...");
  //       setTxState("Approving token...");
  //       const detail = await reserveTokenWriteContract.approve(
  //         contracts.MCV2_Bond,
  //         BigInt(wei(Number(inputValue))),
  //       );
  //       console.log("Approval detail:", detail);
  //     }

  //     console.log("Minting token...");
  //     setTxState("Minting token...");
  //     const mintDetail = await bondWriteContract.mint(
  //       createdTokenAddress,
  //       BigInt(wei(Number(inputValue))),
  //       MAX_INT_256,
  //       account.address,
  //     );
  //     console.log("Mint detail:", mintDetail);
  //     setTxState("Success");
  //   } catch (error: any) {
  //     console.error("Error:", error);
  //     setTxState("ERR");
  //   }
  // }

  const [isToggle, setIsToggle] = useState(false);
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [desc, setDesc] = useState("");
  const [tw, setTw] = useState("");
  const [tg, setTg] = useState("");
  const [web, setWeb] = useState("");

  const inputFile = useRef(null);

  const nameHandler = (event: any) => {
    setName(event.target.value);
  };
  const tickerHandler = (event: any) => {
    setTicker(event.target.value);
  };
  const descHandler = (event: any) => {
    setDesc(event.target.value);
  };
  const twHandler = (event: any) => {
    setTw(event.target.value);
  };
  const tgHandler = (event: any) => {
    setTg(event.target.value);
  };
  const webHandler = (event: any) => {
    setWeb(event.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    }
  };
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.target.value);
  // };
  // const ether = (weiValue: bigint, decimals = 18): number => {
  //   const factor = BigInt(10) ** BigInt(decimals);
  //   const etherValue = Number(weiValue) / Number(factor);
  //   return etherValue;
  // };

  // const bondContract = new ethers.Contract(
  //   contracts.MCV2_Bond,
  //   MCV2_BondABI,
  //   provider,
  // );
  // const [priceForNextMint, setPriceForNextMint] = useState(0);
  // const getNextMintPrice = async (tokenAddress: string) => {
  //   try {
  //     if (!account.address) {
  //       throw new Error("Account is not defined");
  //     }

  //     const detail = await bondContract.priceForNextMint(tokenAddress);
  //     setPriceForNextMint(detail);
  //     console.log("NextMintPrice :" + detail);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // MARK: - Modal
  const [inputValue, setInputValue] = useState("");
  const [InputState, setInputState] = useState(true);

  // const FirstBuyModal = () => {
  //   return (
  //     <ModalRootWrapper>
  //       <ModalContentBox>
  //         <div className="flex flex-col items-center justify-center gap-[15px]">
  //           <h1 className="whitespace-pre text-[22px] font-bold text-white">{`Select the amount of [token ticker]\nyou wish to buy`}</h1>
  //           <h1 className="text-[18px] text-[#8f8f8f]">(this is optional)</h1>
  //         </div>

  //         <form
  //           onSubmit={modalBuy}
  //           className="flex flex-col items-center justify-center gap-[15px]"
  //         >
  //           <div className="relative flex w-full items-center">
  //             {modalToggle ? (
  //               <div className="w-full">
  //                 <div className="relative flex w-full items-center">
  //                   <input
  //                     className="my-[8px] h-[55px] w-full rounded-[5px] border border-[#5C5C5C] bg-black px-[20px] text-[#5C5C5C]"
  //                     type="number"
  //                     placeholder="0.00"
  //                     step="0.01"
  //                     name="inputValue"
  //                     value={inputValue}
  //                     onChange={handleInputChange}
  //                   ></input>
  //                   <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
  //                     <div className="h-[24px] w-[24px] rounded-full bg-gray-100"></div>
  //                     <h1 className="mt-1 text-[15px] font-bold text-white">
  //                       {name}
  //                     </h1>
  //                   </div>
  //                 </div>
  //                 <h1 className="text-[#B8B8B8]">
  //                   {/* {curMemeTokenValue}&nbsp; */}
  //                   {/* {name} */}
  //                   {ether(BigInt(inputValue) * BigInt(priceForNextMint))}
  //                   &nbsp; WSEI
  //                 </h1>
  //               </div>
  //             ) : (
  //               <>
  //                 <>
  //                   <div className="relative flex w-full items-center">
  //                     <input
  //                       className="my-[8px] h-[55px] w-full rounded-[5px] border border-[#5C5C5C] bg-black px-[20px] text-[#5C5C5C]"
  //                       type="number"
  //                       placeholder="0.00"
  //                       step="0.01"
  //                       name="inputValue"
  //                       value={inputValue}
  //                       onChange={handleInputChange}
  //                     ></input>
  //                     <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
  //                       <div className="h-[24px] w-[24px] rounded-full bg-gray-100"></div>
  //                       <h1 className="mt-1 text-[15px] font-bold text-white">
  //                         WSEI
  //                       </h1>
  //                     </div>
  //                   </div>
  //                   <h1 className="text-[#B8B8B8]">
  //                     {Number(
  //                       wei(Number(inputValue)) / BigInt(priceForNextMint),
  //                     )}
  //                     &nbsp;{name}
  //                   </h1>
  //                 </>
  //               </>
  //             )}
  //             {/* <div className="absolute right-0 mr-[20px] flex items-center gap-[5px]">
  //               <Image
  //                 width={24}
  //                 height={24}
  //                 src={"/icons/sei.svg"}
  //                 alt="sei logo"
  //                 className="rounded-full"
  //               />
  //               <h1 className="mt-1 text-[15px] font-bold text-white">SEI</h1>
  //             </div> */}
  //           </div>

  //           <div className="my-[15px] flex h-[20px] w-[360px] items-center justify-between">
  //             <h1 className="text-sm text-white">{`Insufficient balance : You have 0.02313 SEI`}</h1>
  //             <div
  //               onClick={() => setModalToggle(!modalToggle)}
  //               className={`flex h-[12px] w-[46px] cursor-pointer ${modalToggle && "flex-row-reverse"} items-center justify-between rounded-full bg-[#4E4B4B]`}
  //             >
  //               <div className="h-full w-[12px] rounded-full bg-[#161616]"></div>
  //               <div
  //                 className={`h-[24px] w-[24px] rounded-full ${modalToggle ? "bg-[#00FFF0]" : "bg-[#43FF4B]"}`}
  //               ></div>
  //             </div>
  //           </div>

  //           <div className="flex flex-col items-center justify-center gap-[15px]">
  //             <button
  //               className={`flex h-[60px] w-[400px] items-center justify-center rounded-[8px] font-['Impact'] text-[16px] font-light tracking-wider text-white ${isLoading ? "bg-[#900000]" : "bg-gradient-to-b from-[#FF0000] to-[#900000] shadow-[0_0px_20px_rgba(255,38,38,0.5)]"} `}
  //             >
  //               create token
  //             </button>
  //             <h1 className="text-[15px] font-normal text-white">
  //               cost to deploy : ~0.02 SEI
  //             </h1>
  //           </div>
  //         </form>
  //       </ModalContentBox>
  //     </ModalRootWrapper>
  //   );
  // };

  return (
    <>
      {/* {isModalVisible && <FirstBuyModal />} */}
      <div className=" w-screen bg-[#0E0E0E] ">
        <div className="mx-auto h-full w-[500px] ">
          <div className="mx-auto h-full w-[484px] pt-[30px]">
            <div className="">
              <Image
                src="/images/Preview.svg"
                alt=""
                width={500}
                height={500}
                className="mx-auto h-full w-1/4"
              />
              <div className="flex h-[185px] w-full justify-between gap-[10px] border border-dashed border-[#F9FF00] p-[10px] shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]">
                <div>
                  {cid ? (
                    <div className="h-[120px] w-[120px]">
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                        alt="Image from IPFS"
                      />
                    </div>
                  ) : (
                    <div className="h-[120px] w-[120px] bg-[#D9D9D9]"></div>
                  )}
                </div>
                <div className=" text w-[334px] overflow-hidden px-[10px]">
                  <div className="">
                    <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                      {name ? name : "Name"}
                    </h1>
                    <h1 className="text-[15px] font-bold leading-none text-[#ADADAD]">
                      [ticker: {ticker ? ticker : "ticker"}]
                    </h1>
                  </div>

                  <div className="flex items-center gap-[5px]">
                    <h1 className="neon-lime text-xs text-[#C5F900] ">
                      Created by:
                    </h1>
                    <Image
                      className="rounded-full"
                      src="/images/Seiyan.png"
                      alt=""
                      width={12}
                      height={12}
                    />
                    <h1 className="neon-lime text-xs text-[#C5F900] ">
                      {account.address?.substring(0, 5)}
                    </h1>
                  </div>

                  <div className="flex">
                    <h1 className="neon-yellow text-xs text-[#FAFF00]">
                      Market cap:&nbsp;
                    </h1>
                    <h1
                      className={`neon-yellow ${digital.variable} font-digital text-xs text-[#FAFF00]`}
                    >
                      0.00K
                    </h1>
                  </div>

                  <h1 className="h-[90px] text-[13px] font-normal leading-tight tracking-tight text-[#808080]">
                    {desc
                      ? desc
                      : "Pizza ipsum dolor meat lovers buffalo. Bacon Aussie mozzarella buffalo hand lovers string. Chicago garlic roll banana mayo tomatoes banana pineapple marinara sauce. Thin anchovies deep banana lasagna style ranch pesto string. Onions crust fresh mayo dolor fresh onions pizza buffalo."}
                  </h1>
                </div>
              </div>
            </div>
            <form onSubmit={submit}>
              <h1 className="mt-[30px] pb-[7px] text-[16px] font-normal text-white">
                name
              </h1>
              <input
                name="name"
                type="text"
                placeholder="name (up to 30)"
                value={name}
                onChange={nameHandler}
                className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
              />
              <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
                ticker
              </h1>
              <input
                name="ticker"
                type="text"
                placeholder="ticker (up to 10)"
                value={ticker}
                onChange={tickerHandler}
                className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
              />
              <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
                image
              </h1>
              <input
                ref={inputFile}
                onChange={handleFileChange}
                name="image"
                type="file"
                accept="image/*"
                className=" flex h-[50px] w-full items-center rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
              />
              <h1 className="mt-[15px] pb-[7px] text-[16px] font-normal text-white">
                description
              </h1>
              <textarea
                value={desc}
                onChange={descHandler}
                name="description"
                placeholder="description (up to 100)"
                className="h-[120px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
              />
              <div
                onClick={() => setIsToggle(!isToggle)}
                className="mt-[18px] flex cursor-pointer text-[#FF2626]"
              >
                <h1>more options&nbsp;</h1>
                <h1 className="text-white">{isToggle ? "-" : "+"}</h1>
              </div>
              {isToggle && (
                <>
                  <h1 className="mt-[20px] pb-[7px] text-[16px] font-normal text-white">
                    twitter link
                  </h1>
                  <input
                    value={tw}
                    onChange={twHandler}
                    name="twitter link"
                    type="text"
                    placeholder="(optional)"
                    className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                  />
                  <h1 className="mt-[19px] pb-[7px]  text-[16px] font-normal text-white">
                    telegram link
                  </h1>
                  <input
                    value={tg}
                    onChange={tgHandler}
                    name="telegram link"
                    type="text"
                    placeholder="(optional)"
                    className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                  />
                  <h1 className="mt-[19px] pb-[7px] text-[16px] font-normal text-white">
                    website link
                  </h1>
                  <input
                    value={web}
                    onChange={webHandler}
                    name="website link"
                    type="text"
                    placeholder="(optional)"
                    className="h-[50px] w-full rounded-[5px] border border-[#8F8F8F] bg-[#303030] p-[10px] text-white"
                  />
                </>
              )}
              <button
                type="submit"
                className={`mt-[34px] flex h-[60px] w-full items-center justify-center rounded-[8px] font-['Impact'] text-[16px] font-light tracking-wider text-white ${isLoading ? "bg-[#900000]" : "bg-gradient-to-b from-[#FF0000] to-[#900000] shadow-[0_0px_20px_rgba(255,38,38,0.5)]"} `}
              >
                {isLoading ? (
                  <Image
                    src="/icons/Loading.svg"
                    alt=""
                    height={24}
                    width={24}
                    className=" animate-spin"
                  />
                ) : (
                  <h1>Create Token</h1>
                )}
              </button>
            </form>
            <div className="pb-20"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;

const ModalItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;
