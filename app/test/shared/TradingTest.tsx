import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ISeriesApi,
  UTCTimestamp,
  BarData,
  DeepPartial,
  ChartOptions,
} from "lightweight-charts";
import { ethers } from "ethers";
import contracts from "@/global/contracts";
import MCV2_BondArtifact from "@/abis/MCV2_Bond.sol/MCV2_Bond.json";
import rpcProvider from "@/global/rpcProvider";
import endpoint from "@/global/endpoint";
import { stepPrices } from "@/global/steps";

const provider = new ethers.JsonRpcProvider(rpcProvider);
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
  const [priceHistory, setPriceHistory] = useState<BarData[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null); // Ref for the chart
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null); // Ref for the series
  const [eventsFromDB, setEventsFromDB] = useState<Event[] | null>(null);
  const [chartData, setChartData] = useState<BarData[]>([
    // {
    //   time: Math.floor(Date.now() / 1000) as UTCTimestamp,
    //   open: 0.0,
    //   high: 0.0,
    //   low: 0.0,
    //   close: 0.0,
    // },
  ]);
  const [ready, setReady] = useState(false);
  const [lastPrice, setLastPrice] = useState<number | null>(null);

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

  function bigIntToNumber(bigIntValue: bigint, decimalPlaces: number): number {
    let strValue = bigIntValue.toString();
    let length = strValue.length;

    if (length <= decimalPlaces) {
      strValue = "0".repeat(decimalPlaces - length + 1) + strValue;
      length = strValue.length;
    }

    const integerPart = strValue.slice(0, length - decimalPlaces);
    const fractionalPart = strValue.slice(length - decimalPlaces);
    const formattedString = integerPart + "." + fractionalPart;
    return parseFloat(formattedString);
  }

  const fetchPrice = async () => {
    try {
      const nextPrice = await bondContract.priceForNextMint(tokenAddress);
      return bigIntToNumber(BigInt(nextPrice.toString()), 18);
    } catch (error) {
      console.error("Error fetching price for next mint:", error);
      return null;
    }
  };

  const [getOnce, setGetOnce] = useState(false);

  useEffect(() => {
    fetch(`${endpoint}/TxlogsMintBurn`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = filterEventsByToken(data, tokenAddress);
        setEventsFromDB(filteredData);
        let curMintedToken = BigInt(0);
        if (getOnce) return;
        if (filteredData.length == 0) {
          setChartData([
            {
              time: Math.floor(Date.now() / 1000) as UTCTimestamp,
              open: 0.000002125,
              high: 0.000002125,
              low: 0.000002125,
              close: 0.000002125,
            },
          ]);
        }
        filteredData.reverse().forEach((data, index) => {
          const date = new Date(data.blockTimestamp);
          console.log("date :" + date);
          const timestamp = (Math.floor(date.getTime() / 1000) -
            9 * 60 * 60) as UTCTimestamp;
          // 한국 표준시 UTC로 변환하기 위해 마이너스

          console.log(
            "minted amount!" + BigInt(parseInt(data.amountMinted!._hex, 16)),
          );
          if (data.isMint) {
            curMintedToken += BigInt(parseInt(data.amountMinted!._hex, 16));
          } else {
            curMintedToken -= BigInt(parseInt(data.amountMinted!._hex, 16));
          }
          console.log("curMintedToken :" + curMintedToken);

          const divValue = Math.floor(
            Number(curMintedToken / BigInt(8000000000000000000000000)),
          );
          console.log("divValue :" + divValue);
          if (divValue >= 0) {
            console.log("im in if! :" + stepPrices[divValue]);
            setChartData((prevChartData) => {
              const exists = prevChartData.some(
                (entry) => entry.time === timestamp,
              );
              if (!exists) {
                const newDataPoint = {
                  time: timestamp,
                  open:
                    prevChartData.length > 0
                      ? prevChartData[prevChartData.length - 1].close
                      : 0.000002125,
                  high: Number(stepPrices[divValue]),
                  low: Number(stepPrices[divValue]),
                  close: Number(stepPrices[divValue]),
                };
                return [...prevChartData, newDataPoint];
              }
              return prevChartData;
            });
          }
        });

        if (chartData.length >= 1) {
          setGetOnce(true);
        }

        setReady(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(chartData, null, 2) + "chartdata");
    if (chartData.length == 0) return;
    if (chartContainerRef.current) {
      const chartOptions: DeepPartial<ChartOptions> = {
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
        localization: {
          priceFormatter: (price: number) => price.toFixed(10), // 소수점 이하 10자리 설정
        },
      };

      const chart = createChart(chartContainerRef.current, chartOptions);

      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(chartData);

      // Store the chart and series references
      chartRef.current = chart;
      seriesRef.current = candlestickSeries;

      const updateChartData = async () => {
        const nextPrice = await fetchPrice();
        if (nextPrice !== null) {
          setChartData((prevData) => {
            if (prevData.length === 0) {
              return [
                {
                  time: Math.floor(Date.now() / 1000) as UTCTimestamp,
                  open: nextPrice,
                  high: nextPrice,
                  low: nextPrice,
                  close: nextPrice,
                },
              ];
            }

            const lastDataPoint = prevData[prevData.length - 1];
            if (nextPrice !== lastDataPoint.close) {
              const newTimestamp = (lastDataPoint.time as number) + 5;
              const newDataPoint: BarData = {
                time: newTimestamp as UTCTimestamp,
                open: lastDataPoint.close,
                high: nextPrice,
                low: nextPrice,
                close: nextPrice,
              };
              const newData = [...prevData, newDataPoint];
              if (seriesRef.current) {
                seriesRef.current.setData(newData);
              }
              setLastPrice(nextPrice);
              return newData;
            }

            return prevData;
          });
        }
      };

      // Update data every 3 seconds
      const intervalId = setInterval(updateChartData, 3000);

      return () => {
        clearInterval(intervalId);
        if (chartRef.current) {
          chartRef.current.remove();
        }
        seriesRef.current = null;
        chartRef.current = null;
      };
    }
  }, [ready]);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default TradingViewChart;
