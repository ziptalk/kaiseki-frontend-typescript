// // MARK: - Create Events
// async function fetchCreateEventsInBatches(fromBlock: any, batchSize: any) {
//   let currentBlock = await provider.getBlockNumber();
//   let toBlock = fromBlock + batchSize - 1; // Adjust to ensure the batch size is as specified

//   const isFetchingCreate = localStorage.getItem("isFetchingCreate");
//   if (isFetchingCreate === "true") {
//     console.log(
//       "FetchingCreate is already in progress. Aborting this instance.",
//     );
//     return;
//   }

//   // Set the fetchingCreate flag to true
//   localStorage.setItem("isFetchingCreate", "true");

//   try {
//     while (fromBlock <= currentBlock) {
//       // console.log(
//       //   `FetchingCreate events from block ${fromBlock} to ${toBlock}`,
//       // );

//       // Adjust toBlock for the last batch if it exceeds currentBlock
//       if (toBlock > currentBlock) {
//         toBlock = currentBlock;
//       }

//       let events;
//       try {
//         events = await contract.queryFilter(
//           contract.filters.TokenCreated(),
//           fromBlock,
//           toBlock,
//         );
//       } catch (error) {
//         console.error("Error fetching events:", error);
//         break; // Exit the loop if there's an error fetching events
//       }

//       let newDatas;
//       try {
//         newDatas = await Promise.all(
//           events
//             .slice(0)
//             .reverse()
//             .map(async (event: any) => {
//               const block = await provider.getBlock(event.blockNumber);
//               const timestamp = block.timestamp;
//               const date = new Date(timestamp * 1000);

//               // Format the date as DD/MM/YY
//               const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

//               // Log the event details along with the block timestamp
//               console.log(
//                 `Token Created: ${event.args.name} (${event.args.symbol}), Token Address: ${event.args.token}, Reserve Token: ${event.args.reserveToken} Block Timestamp: ${date}`,
//               );
//               setCurCreateTic(event.args.symbol.substring(0, 5));
//               setCurCreateUser(event.args.token.substring(0, 5)); // Fake value!
//               setCurCreateTime(formattedDate);

//               return {
//                 tic: event.args.symbol.substring(0, 5),
//                 user: event.args.token.substring(0, 5), // Fake value!
//                 time: formattedDate,
//               };
//             }),
//         );
//       } catch (error) {
//         console.error("Error processing events:", error);
//         break; // Exit the loop if there's an error processing events
//       }

//       setCreateDatas((prevDatas) => [...newDatas, ...prevDatas]);

//       // Prepare for the next batch
//       fromBlock = toBlock + 1;
//       toBlock = fromBlock + batchSize - 1;

//       // Small delay to prevent rate limiting (optional, adjust as necessary)
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     }
//   } catch (error) {
//     console.error("Unexpected error:", error);
//   } finally {
//     localStorage.setItem("isFetchingCreate", "false");
//   }
// }

// // MARK: - Mint Events
// async function fetchMintEventsInBatches(fromBlock: any, batchSize: any) {
//   let currentBlock = await provider.getBlockNumber();
//   let toBlock = fromBlock + batchSize - 1; // Adjust to ensure the batch size is as specified

//   const isFetching = localStorage.getItem("isFetching");
//   if (isFetching === "true") {
//     console.log("Fetching is already in progress. Aborting this instance.");
//     return;
//   }

//   // Set the fetching flag to true
//   localStorage.setItem("isFetching", "true");

//   while (fromBlock <= currentBlock) {
//     // console.log(`Fetching events from block ${fromBlock} to ${toBlock}`);

//     // Adjust toBlock for the last batch if it exceeds currentBlock
//     if (toBlock > currentBlock) {
//       toBlock = currentBlock;
//     }

//     const events = await contract.queryFilter(
//       contract.filters.Mint(),
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

//           // Format the date as DD/MM/YY
//           const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

//           // Log the event details along with the block timestamp
//           console.log(
//             `Token Minted: ${event.args.token}, Amount: ${event.args.amountMinted}, Buyer: ${event.args.receiver}, Block Timestamp: ${date.toLocaleString()}`,
//           );
//           setCurMintTic(event.args.token.substring(0, 5));
//           setCurMintValue(String(ether(event.args.amountMinted)));
//           setCurMintUser(event.args.receiver.substring(0, 5));
//           setCurMintTime(formattedDate);

//           return {
//             val: String(ether(event.args.amountMinted)),
//             tic: event.args.token.substring(0, 5),
//             user: event.args.receiver.substring(0, 5),
//             time: formattedDate,
//           };
//         }),
//     );

//     setDatas((prevDatas) => [...newDatas, ...prevDatas]);

//     // Prepare for the next batch
//     fromBlock = toBlock + 1;
//     toBlock = fromBlock + batchSize - 1;

//     // Small delay to prevent rate limiting (optional, adjust as necessary)
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//   }

//   // Reset the fetching flag
//   localStorage.setItem("isFetching", "false");
// }
// usage: Fetch events in batches of 5000 blocks starting from block 19966627
// usage: Fetch events in batches of 5000 blocks starting from block 19966627

// useEffect(() => {
//   fetchMintEventsInBatches(20587998, 5000);
//   fetchCreateEventsInBatches(19966627, 5000);
//   setModalVisible();
// }, []);
