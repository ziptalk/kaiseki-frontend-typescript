"use client";

import React, { useEffect, useState } from "react";

function App() {
  const [priceHistory, setPriceHistory] = useState(null);
  const [eventsFromDB, setEventsFromDB] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  const targetToken = "0x776D15B613902456690F8966943Bc074c0ff4b0f";
  useEffect(() => {
    fetch("http://memesino.fun/priceHistory")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        );
        setPriceHistory(filteredData);
      });

    fetch("http://memesino.fun/TxlogsMintBurn")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.burnEvents.filter(
          (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        );
        setEventsFromDB(filteredData);
      });

    fetch("http://memesino.fun/HolderDistribution")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        );
        setDistribution(filteredData);
      });
    fetch("http://memesino.fun/homeTokenInfo") // Add this block
      .then((response) => response.json())
      .then((data) => setTokenInfo(data));
    // const val = main();
    // console.log(val);
  }, []);

  return (
    <div className="App">
      <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
      <h1>REST API Example</h1>
      <pre>{JSON.stringify(distribution, null, 2)}</pre>
      <h2>Price History</h2>
      <pre>{JSON.stringify(priceHistory, null, 2)}</pre>
      <h2>Events from DB</h2>
      <pre>{JSON.stringify(eventsFromDB, null, 2)}</pre>
    </div>
  );
}

export default App;
