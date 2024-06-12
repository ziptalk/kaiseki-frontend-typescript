// const getWSEIValue = async () => {
//   try {
//     if (!window.ethereum) {
//       throw new Error("MetaMask is not installed!");
//     }
//     if (account.address == null) {
//       setCurMemeTokenValue("0");
//       return;
//     }
//     const balanceWei = await reserveTokenContract.balanceOf(account.address);
//     // Convert the balance to Ether
//     const balanceEther = ether(balanceWei);
//     // console.log(balanceEther);
//     setCurWSEIValue(String(balanceEther));
//   } catch (error) {
//     console.log(error);
//   }
// };
