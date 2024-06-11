"use client";

import endpoint from "@/global/endpoint";
import React, { useEffect, useState } from "react";

function App() {
  const [priceHistory, setPriceHistory] = useState(null);
  const [eventsFromDB, setEventsFromDB] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  const targetToken = "0xB62139cCfE65CE9699735932C94ee39396373D41";
  useEffect(() => {
    fetch(`${endpoint}/priceHistory`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        );
        setPriceHistory(filteredData);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${endpoint}/TxlogsMintBurn`)
      .then((response) => response.json())
      .then((data) => {
        // const filteredData = data.burnEvents.filter(
        //   (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        // );
        // setEventsFromDB(filteredData);
        setEventsFromDB(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${endpoint}/HolderDistribution`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        );
        setDistribution(filteredData);
        setDistribution(data);
      })
      .catch((error) => {
        console.log(error);
      });
    fetch(`${endpoint}/homeTokenInfo`) // Add this block
      .then((response) => response.json())
      .then((data) => setTokenInfo(data))
      .catch((error) => {
        console.log(error);
      });
    // const val = main();
    // console.log(val);
  }, []);

  return (
    <div className="bg-white">
      {/* <pre>{JSON.stringify(tokenInfo, null, 2)}</pre> */}
      <h1>distribution</h1>
      <pre>{JSON.stringify(distribution, null, 2)}</pre>
      {/* <h2>Price History</h2>
      <pre>{JSON.stringify(priceHistory, null, 2)}</pre> */}
      {/* <h2>Events from DB</h2>
      <pre>{JSON.stringify(eventsFromDB, null, 2)}</pre> */}
    </div>
  );
}

export default App;
