import { FC } from "react";

const TradesCard: FC<TradesCardType> = ({
  isBuy,
  reserveAmount,
  memeTokenAmount,
  date,
  tx,
  user,
}) => {
  const NMA = Number(memeTokenAmount);
  let SMA = NMA;
  let legitK = false;
  if (NMA > 1000) {
    SMA = NMA / 1000;
    legitK = true;
  }
  const data = [reserveAmount, legitK ? SMA + "k" : SMA, date];
  return (
    <>
      <div className="flex h-[60px] items-center justify-between rounded-[10px] bg-[#313131] px-[20px] py-[15px] text-[13px] text-[#808080]">
        <div className="flex w-[14%] items-center gap-[5px]">
          <img src="/icons/bomb.svg" alt="" style={{ width: 18, height: 18 }} />
          <h1
            className="cursor-pointer text-[#9AFFC2] hover:underline"
            onClick={() => {
              window.open(`https://basescan.org/address/${user}`);
            }}
          >
            {user.length > 8 ? user.substring(0, 6) + "..." : user}
          </h1>
        </div>
        <h1
          className={`${isBuy ? "text-[#6BD650]" : "text-[#D64F4F]"} w-[14%] font-bold`}
        >
          {isBuy ? "buy" : "sell"}
        </h1>
        {data.map((item, index) => (
          <h1 key={index} className="w-[14%] overflow-scroll text-nowrap">
            {item}
          </h1>
        ))}
        <h1
          className="w-[14%] cursor-pointer overflow-scroll text-nowrap text-right hover:underline"
          onClick={() => {
            window.open(`https://basescan.org/tx/${tx}`);
          }}
        >
          {tx.slice(0, 6) + "..." + tx.slice(-4)}
        </h1>
      </div>
    </>
  );
};

export default TradesCard;
