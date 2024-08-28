"use client";

import { SERVER_ENDPOINT } from "@/global/projectConfig";
import React, { useEffect, useState } from "react";

function App() {
  const [priceHistory, setPriceHistory] = useState(null);
  const [ttm, setTtm] = useState(null);
  const [eventsFromDB, setEventsFromDB] = useState<Event[] | null>(null);
  const [distribution, setDistribution] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  const targetToken = "0xF0454347226818b5f8D68e2C8c9B090C666BE1e9";
  useEffect(() => {
    fetch(
      `${SERVER_ENDPOINT}/priceHistory?tokenAddress=0xB62139cCfE65CE9699735932C94ee39396373D41`,
    )
      .then((response) => response.json())
      .then((data) => {
        // const filteredData = data.filter(
        //   (item: any) => item.token.toLowerCase() === targetToken.toLowerCase(),
        // );
        // setPriceHistory(filteredData);
        setPriceHistory(data.mintEvents);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${SERVER_ENDPOINT}/TxlogsMintBurn`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = filterEventsByToken(data, targetToken);
        setEventsFromDB(filteredData);
        // setEventsFromDB(data.mintEvents.reverse());
        // setEventsFromDB(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${SERVER_ENDPOINT}/ToTheMoon`)
      .then((response) => response.json())
      .then((data) => {
        setTtm(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${SERVER_ENDPOINT}/HolderDistribution`)
      .then((response) => response.json())
      .then((data) => {
        // const filteredData = data.filter(
        //   (item: any) => item.toLowerCase() === targetToken.toLowerCase(),
        // );
        // setDistribution(filteredData);
        setDistribution(data);
      })
      .catch((error) => {
        console.log(error);
      });
    fetch(`${SERVER_ENDPOINT}/homeTokenInfo`) // Add this block
      .then((response) => response.json())
      .then((data) => setTokenInfo(data))
      .catch((error) => {
        console.log(error);
      });
    // const val = main();
    // console.log(val);
  }, []);

  function filterEventsByToken(data: any, token: any): Event[] {
    const filteredMintEvents = data.mintEvents
      .filter((event: any) => event.token.tokenAddress === token)
      .map((event: any) => ({ ...event, isMint: true }));

    const filteredBurnEvents = data.burnEvents
      .filter((event: any) => event.token === token)
      .map((event: any) => ({ ...event, isMint: false }));

    const combinedEvents = [...filteredMintEvents, ...filteredBurnEvents];
    combinedEvents.sort(
      (a, b) =>
        new Date(b.blockTimestamp).getTime() -
        new Date(a.blockTimestamp).getTime(),
    );

    return combinedEvents;
  }

  return (
    <div className="bg-white">
      {/* <h1 className="text-[40px]">Token Info</h1>
      <pre>{JSON.stringify(tokenInfo, null, 2)}</pre> */}
      {/* <h1 className="text-[40px]">Holder distribution</h1>
      <pre>{JSON.stringify(distribution, null, 2)}</pre> */}
      {/* <h2 className="text-[40px]">Price History</h2>
      <pre>{JSON.stringify(priceHistory, null, 2)}</pre> */}
      {/* <h2 className="text-[40px]">Events from DB</h2>
      <pre>{JSON.stringify(eventsFromDB, null, 2)}</pre> */}
      <h2 className="text-[40px]">To the moon</h2>
      <pre>{JSON.stringify(ttm, null, 2)}</pre>
    </div>
  );
}

export default App;
