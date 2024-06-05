import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ISeriesApi,
  UTCTimestamp,
  BarData,
} from "lightweight-charts";
import { ethers } from "ethers";
import contracts from "@/contracts/contracts";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";

const provider = new ethers.JsonRpcProvider(
  "https://evm-rpc-arctic-1.sei-apis.com",
);
const { abi: MCV2_BondABI } = MCV2_BondArtifact;
const bondContract = new ethers.Contract(
  contracts.MCV2_Bond,
  MCV2_BondABI,
  provider,
);

type TradingViewChartProps = {
  tokenAddress: string;
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  tokenAddress,
}) => {
  // const [priceHistory, setPriceHistory] = useState(null);

  // useEffect(() => {
  //   fetch(`https://memesino.fun/priceHistory?tokenAddress=${tokenAddress}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (Array.isArray(data)) {
  //         const transformedData: BarData[] = data.map((item: any) => ({
  //           time: Math.floor(
  //             new Date(item.changeTime).getTime() / 1000,
  //           ) as UTCTimestamp,
  //           open: parseInt(item.oldPrice, 10),
  //           high: parseInt(item.newPrice, 10),
  //           low: parseInt(item.newPrice, 10),
  //           close: parseInt(item.newPrice, 10),
  //         }));
  //         setChartData(transformedData);
  //       } else {
  //         console.log("Data is not an array:", data);
  //         setChartData([]);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [tokenAddress]);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [chartData, setChartData] = useState<BarData[]>([
    {
      time: Math.floor(Date.now() / 1000) as UTCTimestamp,
      open: 2000000000,
      high: 2000000000,
      low: 2000000000,
      close: 2000000000,
    },
    // additional data...
  ]);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: "#222" },
          textColor: "#DDD",
        },
        grid: {
          vertLines: { color: "#444" },
          horzLines: { color: "#444" },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          tickMarkFormatter: (time: UTCTimestamp) => {
            const date = new Date(time * 1000);
            return `${date.getUTCHours().toString().padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}:${date.getUTCSeconds().toString().padStart(2, "0")}`;
          },
        },
      });

      const candlestickSeries: ISeriesApi<"Candlestick"> =
        chart.addCandlestickSeries();
      candlestickSeries.setData(chartData);

      const fetchPrice = async () => {
        try {
          const nextPrice = await bondContract.priceForNextMint(tokenAddress);
          return Number(nextPrice);
        } catch (error) {
          console.error("Error fetching price for next mint:", error);
          return null;
        }
      };

      const updateChartData = async () => {
        const nextPrice = await fetchPrice();
        if (nextPrice !== null) {
          setChartData((prevData) => {
            const lastDataPoint = prevData[prevData.length - 1];
            const updatedDataPoint: BarData = {
              ...lastDataPoint,
              high: Math.max(lastDataPoint.high, nextPrice),
              low: Math.min(lastDataPoint.low, nextPrice),
              close: nextPrice,
            };
            candlestickSeries.update(updatedDataPoint);
            const newData = [...prevData.slice(0, -1), updatedDataPoint];
            return newData;
          });
        }
      };

      // Update data every 3 seconds
      const intervalId = setInterval(updateChartData, 3000);

      // Add new candle every 5 seconds
      const fiveSecondIntervalId = setInterval(() => {
        setChartData((prevData) => {
          const lastDataPoint = prevData[prevData.length - 1];
          const newTimestamp = (lastDataPoint.time as number) + 5;
          const newDataPoint: BarData = {
            time: newTimestamp as UTCTimestamp,
            open: lastDataPoint.close,
            high: lastDataPoint.close,
            low: lastDataPoint.close,
            close: lastDataPoint.close,
          };
          const newData = [...prevData, newDataPoint];
          candlestickSeries.setData(newData); // This will replace the entire data set
          return newData;
        });
      }, 30000); // Add new candle every 5 seconds

      return () => {
        clearInterval(intervalId);
        clearInterval(fiveSecondIntervalId);
        chart.remove();
      };
    }
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default TradingViewChart;
