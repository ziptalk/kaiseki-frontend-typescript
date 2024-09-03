import { MyPageTokenCard } from "@/components/common/HomeTokenCard";
import React from "react";

export const MyMeme = () => {
  return (
    <div>
      <MyPageTokenCard
        {...{
          name: "Meme",
          ticker: "F1T",
          marketCap: "100.001",
          description: "Meme",
          tokenAddress: "F1T",
          clickedToken: "",
          cid: "QmeSwf4GCPw1TBpimcB5zoreCbgGL5fEo7kTfMjrNAXb3U",
        }}
      />
    </div>
  );
};
