import React from "react";

interface BuySellLayoutProps {
  tokenAddress: string;
}

export const BuySellLayout = () => {
  // const fetchTokenDetailFromContract = async ({tokenAddress}: BuySellLayoutProps) => {
  //   try {
  //     const detail = await bondContract.getDetail(tokenAddress);
  //     const price = detail.info.priceForNextMint;
  //     // console.log("currentSupply :" + detail.info.currentSupply);
  //     setMemeTokenName(detail.info.name);
  //     setMemeTokenSymbol(detail.info.symbol);
  //     setCreator(detail.info.creator);
  //     const mcap = (
  //       Number(ethers.formatEther(price.toString())) * BILLION
  //     ).toFixed(2);
  //     // console.log("this is mcap" + mcap);
  //     const response = await axios.get(
  //       `https://api.binance.com/api/v3/ticker/price?symbol=${RESERVE_SYMBOL}USDT`,
  //     );
  //     const marketCapInUSD = (response.data.price * Number(mcap)).toFixed(0);

  //     await updateMarketCapToServer(tokenAddress, marketCapInUSD);
  //     setMarketCap(marketCapInUSD);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const fetchHomeTokenInfoFromServer = async (
  //   tokenAddress: any,
  //   setCid: any,
  //   setTw: any,
  //   setTg: any,
  //   setWeb: any,
  //   setDesc: any,
  // ) => {
  //   try {
  //     const response = await fetch(`${SERVER_ENDPOINT}/homeTokenInfo`);
  //     const data = await response.json();
  //     const filteredData = data.filter(
  //       (item: any) => item.tokenAddress === tokenAddress,
  //     );
  //     if (filteredData.length > 0) {
  //       setCid(filteredData[0].cid);
  //       setTw(filteredData[0].twitterUrl);
  //       setTg(filteredData[0].telegramUrl);
  //       setWeb(filteredData[0].websiteUrl);
  //       setDesc(filteredData[0].description);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return <div className="mt-[146px] w-[471px] bg-[#252525]">BuySellLayout</div>;
};
