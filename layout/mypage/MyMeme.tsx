import { MyPageTokenCard } from "@/components/common/HomeTokenCard";
import { UsersMemes } from "@/utils/apis/apis";
import React from "react";

export const MyMeme = ({
  userAddress,
  setModal,
}: {
  userAddress: `0x${string}` | undefined;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [MyMemes, setMyMemes] = React.useState([]);

  const getMyMemes = async () => {
    setMyMemes(await UsersMemes(userAddress));
  };

  React.useEffect(() => {
    getMyMemes();
  }, []);

  return (
    <div className="flex flex-col gap-8 px-5">
      {MyMemes.map((meme: any, index) => (
        <MyPageTokenCard
          {...{
            name: meme.name,
            ticker: meme.ticker,
            description: meme.description,
            tokenAddress: meme.tokenAddress,
            cid: meme.cid,
            rafflePrize: meme.rafflePrize,
            setModal,
          }}
          key={index}
        />
      ))}
    </div>
  );
};
