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

  const [chartData, setChartData] = useState<BarData[]>([
    {
      time: Math.floor(Date.now() / 1000) as UTCTimestamp,
      open: 0.0,
      high: 0.0,
      low: 0.0,
      close: 0.0,
    },
    // additional data...
  ]);

  useEffect(() => {
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

      function bigIntToNumber(
        bigIntValue: bigint,
        decimalPlaces: number,
      ): number {
        // 정수 부분과 소수 부분을 분리할 위치 계산
        let strValue = bigIntValue.toString();
        let length = strValue.length;

        // 소수점 이하 자릿수가 필요한 자리수보다 적을 경우 0을 채움
        if (length <= decimalPlaces) {
          strValue = "0".repeat(decimalPlaces - length + 1) + strValue;
          length = strValue.length;
        }

        // 소수점 위치 계산
        let integerPart = strValue.slice(0, length - decimalPlaces);
        let fractionalPart = strValue.slice(length - decimalPlaces);

        // 정수 부분과 소수 부분을 결합하여 숫자로 변환
        let formattedString = integerPart + "." + fractionalPart;
        let numberValue = parseFloat(formattedString);

        return numberValue;
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
            if (seriesRef.current) {
              seriesRef.current.update(updatedDataPoint);
            }
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
          if (seriesRef.current) {
            seriesRef.current.setData(newData); // This will replace the entire data set
          }
          return newData;
        });
      }, 5000);

      return () => {
        clearInterval(intervalId);
        clearInterval(fiveSecondIntervalId);
        if (chartRef.current) {
          chartRef.current.remove();
        }
        seriesRef.current = null;
        chartRef.current = null;
      };
    }
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
  );
};

export default TradingViewChart;
