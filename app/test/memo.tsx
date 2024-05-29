// const checkPriceAndCreatePool = async () => {
//   // 여기에 가격을 확인하는 로직을 추가합니다.
//   const currentPrice = await getCurrentPrice(); // 가격 가져오기
//   const targetPrice = ethers.utils.parseUnits("your_target_price", "ether");
//   if (currentPrice >= targetPrice) {
//     await createPool();
//   }
// };
// const createPool = async () => {
//   const dragonswapRouterAddress = "0xDragonswapRouterAddress"; // Dragonswap Router 주소
//   const dragonswapRouterABI = [
//     /* Dragonswap Router ABI */
//   ];
//   const tokenAddress = "0xYourTokenAddress";
//   const wethAddress = "0xWETHAddress"; // 예를 들어 ETH와 풀을 만드는 경우
//   const routerContract = new ethers.Contract(
//     dragonswapRouterAddress,
//     dragonswapRouterABI,
//     signer,
//   );
//   const amountTokenDesired = ethers.utils.parseUnits("1000", 18); // 공급할 토큰 양
//   const amountETHDesired = ethers.utils.parseUnits("10", "ether"); // 공급할 ETH 양
//   const tx = await routerContract.addLiquidityETH(
//     tokenAddress,
//     amountTokenDesired,
//     amountTokenDesired.mul(95).div(100), // 최소 수량: 5% 슬리피지
//     amountETHDesired.mul(95).div(100), // 최소 수량: 5% 슬리피지
//     await signer.getAddress(),
//     Math.floor(Date.now() / 1000) + 60 * 20, // 20분 내에 완료
//     { value: amountETHDesired },
//   );
//   await tx.wait();
//   console.log("Pool created and token listed on Dragonswap.");
// }; // 주기적으로 가격을 확인합니다.
// setInterval(checkPriceAndCreatePool, 60000); // 1분마다 확인

// // Initialize ethers with a provider
// const { ethers } = require("ethers");

// // Load the ABI from the specified file
// const contractABI = abi;

// // Contract address
// const contractAddress = contracts.MCV2_Bond;

// // Initialize ethers with a provider
// const provider = new ethers.JsonRpcProvider(
//   "https://evm-rpc-arctic-1.sei-apis.com",
// );

// // Create a contract instance
// const contract = new ethers.Contract(contractAddress, contractABI, provider);

// async function fetchCreateHomeEventsInBatches(
//   fromBlock: any,
//   batchSize: any,
// ) {
//   let currentBlock = await provider.getBlockNumber();
//   let toBlock = fromBlock + batchSize - 1; // Adjust to ensure the batch size is as specified

//   const isFetchingHomeCreate = localStorage.getItem("isFetchingHomeCreate");
//   if (isFetchingHomeCreate === "true") {
//     console.log(
//       "FetchingHomeCreate is already in progress. Aborting this instance.",
//     );
//     localStorage.setItem("isFetchingHomeCreate", "false");
//     return;
//   }

//   // Set the fetchingHomeCreate flag to true
//   localStorage.setItem("isFetchingHomeCreate", "true");

//   while (fromBlock <= currentBlock) {
//     // console.log(
//     //   `FetchingHomeCreate events from block ${fromBlock} to ${toBlock}`,
//     // );

//     // Adjust toBlock for the last batch if it exceeds currentBlock
//     if (toBlock > currentBlock) {
//       toBlock = currentBlock;
//     }

//     const events = await contract.queryFilter(
//       contract.filters.TokenCreated(),
//       fromBlock,
//       toBlock,
//     );
//     const newDatas = await Promise.all(
//       events
//         .slice(0)
//         .reverse()
//         .map(async (event: any) => {
//           const block = await provider.getBlock(event.blockNumber);
//           const timestamp = block.timestamp;
//           const date = new Date(timestamp * 1000);
//           const detail = await contract.getDetail(event.args.token);
//           const response = await axios.get(
//             `https://api.binance.com/api/v3/ticker/price?symbol=SEIUSDT`,
//           );
//           const currentSupply = detail.info.currentSupply;
//           const price = detail.info.priceForNextMint;
//           // console.log("cursup" + currentSupply);
//           // console.log("price" + price);
//           // Format the date as DD/MM/YY
//           const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

//           // Log the event details along with the block timestamp
//           // console.log(
//           //   `Token Created: ${event.args.name} (${event.args.symbol}), Token Address: ${event.args.token}, Reserve Token: ${event.args.reserveToken} Block Timestamp: ${date}`,
//           // );

//           // setCurCreateTic(event.args.symbol.substring(0, 5));
//           // setCurCreateUser(event.args.token.substring(0, 5)); // Fake value!
//           // setCurCreateTime(formattedDate);

//           return {
//             name: event.args.name,
//             tic: event.args.symbol.substring(0, 5),
//             user: event.args.token.substring(0, 5), // Fake value!
//             time: formattedDate,
//             addr: event.args.token,
//             cap: ether(currentSupply) * (ether(price) * response.data.price),
//           };
//         }),
//     );

//     // setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

//     // Prepare for the next batch
//     fromBlock = toBlock + 1;
//     toBlock = fromBlock + batchSize - 1;

//     // Small delay to prevent rate limiting (optional, adjust as necessary)
//     // await new Promise((resolve) => setTimeout(resolve, 1));
//   }
//   localStorage.setItem("isFetchingHomeCreate", "false");
// }

// useEffect(() => {
//   fetchCreateHomeEventsInBatches(19966627, 5000);
// }, []);

// const [curCreateTic, setCurCreateTic] = useState("MEME");
// const [curCreateUser, setCurCreateUser] = useState("0x7A2");
// const [curCreateTime, setCurCreateTime] = useState("Date");
// const [curCreateName, setCurCreateName] = useState("Name");
// const [curCreateAddress, setCurCreateAddress] = useState("");
// const [createDatas, setCreateDatas] = useState<any[]>([]);
