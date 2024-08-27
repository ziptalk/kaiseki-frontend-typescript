import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { SERVER_ENDPOINT } from "@/global/projectConfig";
import { TokenDesc } from "../atoms/TokenDesc";

export const RWATokenCard: FC = () => {
  const [kingName, setKingName] = useState("KingCat");
  const [kingTicker, setKingTicker] = useState("KING");
  const [kingCreator, setKingCreator] = useState("Me");
  const [kingMarketCap, setKingMarketCap] = useState("0");
  const [kingDesc, setKingDesc] = useState(
    "Figma ipsum component variant main layer. Stroke opacity blur style bullet group library pencil content. Pencil effect underline pencil pixel follower.",
  );
  const [kingCid, setKingCid] = useState(
    "QmeSwf4GCPw1TBpimcB5zoreCbgGL5fEo7kTfMjrNAXb3U",
  );

  useEffect(() => {
    getToTheMoonFromServer();
  }, []);

  const getToTheMoonFromServer = () => {
    fetch(`${SERVER_ENDPOINT}/ToTheMoon`) // Add this block
      .then((response) => response.json())
      .then((data) => {
        if (data[0]) {
          setKingName(data[0].name);
          setKingTicker(data[0].symbol);
          setKingCid(data[0].cid);
          setKingCreator(data[0].creator);
          setKingDesc(data[0].description);
          setKingMarketCap(data[0].marketCap);
        }
        // console.log({ tothemoon: data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <Link
      className="flex h-[120px] w-[400px] justify-between gap-[10px] border border-dashed border-[#F9FF00] bg-black p-[10px]  shadow-[0_0px_20px_rgba(0,0,0,0.5)] shadow-[#FF2525]"
      href="/0x2Ed6C164217E3EC792655A866EF3493D2AAfBFb3"
    >
      <img
        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${kingCid}`}
        alt="Image from IPFS"
        className="h-[100px] w-[100px] border-black"
      />
      <TokenDesc
        {...{
          name: kingName,
          ticker: kingTicker,
          creator: kingCreator,
          marketCap: kingMarketCap,
          desc: kingDesc,
        }}
      />
    </Link>
  );
};
