"use client";

import endpoint from "@/global/endpoint";
import React, { useEffect, useState } from "react";

function App() {
  const [priceHistory, setPriceHistory] = useState(null);
  const [eventsFromDB, setEventsFromDB] = useState<Event[] | null>(null);
  const [distribution, setDistribution] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  const targetToken = "0x39E364F94D55D6b94eb2007226fB9BAC64326E56";
  useEffect(() => {
    fetch(
      `${endpoint}/priceHistory?tokenAddress=0xB62139cCfE65CE9699735932C94ee39396373D41`,
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

    fetch(`${endpoint}/TxlogsMintBurn`)
      .then((response) => response.json())
      .then((data) => {
        // const filteredData = filterEventsByToken(data, targetToken);
        // setEventsFromDB(filteredData);
        setEventsFromDB(data.mintEvents.reverse());
      })
      .catch((error) => {
        console.log(error);
      });

    fetch(`${endpoint}/HolderDistribution`)
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
    fetch(`${endpoint}/homeTokenInfo`) // Add this block
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
      .filter((event: any) => event.token === token)
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
      <h1 className="text-[40px]">Token Info</h1>
      <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>
      {/* <h1 className="text-[40px]">Holder distribution</h1>
      <pre>{JSON.stringify(distribution, null, 2)}</pre> */}
      {/* <h2 className="text-[40px]">Price History</h2>
      <pre>{JSON.stringify(priceHistory, null, 2)}</pre> */}
      {/* <h2 className="text-[40px]">Events from DB</h2>
      <pre>{JSON.stringify(eventsFromDB, null, 2)}</pre> */}
    </div>
  );
}

export default App;
