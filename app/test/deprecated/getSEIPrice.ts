// useEffect(() => {
//   const getSeiPrice = async () => {
//     const response = await axios.get(
//       `https://api.binance.com/api/v3/ticker/price?symbol=SEIUSDT`,
//     );
//     console.log("SEI PRICE" + response.data.price);
//     const sp = response.data.price;

//     setSEIPrice(Math.round(sp * 100) / 100);
//   };
//   getSeiPrice();
// }, []);
