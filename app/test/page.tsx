"use client";
import main from "../api/distribution";
import React, { useEffect, useState } from "react";

function App() {
  const [priceHistory, setPriceHistory] = useState(null);
  const [eventsFromDB, setEventsFromDB] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const targetToken = "0xfb4a803Eb8Ca7464AC5ad74ae4D08E9cF676d29c";
  useEffect(() => {
    fetch("http://localhost:3000/priceHistory")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        );
        setPriceHistory(filteredData);
      });

    fetch("http://localhost:3000/TxlogsMintBurn")
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.burnEvents.filter(
          (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        );
        setEventsFromDB(filteredData);
      });

    fetch("http://localhost:3000/HolderDistribution")
      .then((response) => response.json())
      .then((data) => {
        setDistribution(data);
      });

    // const val = main();
    // console.log(val);
  }, []);

  return (
    <div className="App">
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
