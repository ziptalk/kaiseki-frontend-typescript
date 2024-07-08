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
//   const [inputValue, setInputValue] = useState("");
//   const [InputState, setInputState] = useState(true);

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

// async function modalBuy(e: React.FormEvent<HTMLFormElement>) {
//   e.preventDefault();
//   if (!account.address) {
//     alert("Connect your wallet first!");
//     throw new Error("Account is not defined");
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
