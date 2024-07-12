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

import { stepPrices800 } from "@/global/createValue";
import { SERVER_ENDPOINT } from "@/global/projectConfig";

type TradingViewChartProps = {
  tokenAddress: string;
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  tokenAddress,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null); // Ref for the chart
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null); // Ref for the series
  const [chartData, setChartData] = useState<BarData[]>([]);
  const [ready, setReady] = useState(false);
  const [getOnce, setGetOnce] = useState(false);

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
        new Date(a.blockTimestamp).getTime() -
        new Date(b.blockTimestamp).getTime(),
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

  const fetchAndUpdateData = async () => {
    try {
      const response = await fetch(`${SERVER_ENDPOINT}/TxlogsMintBurn`);
      const data = await response.json();
      const filteredData = filterEventsByToken(data, tokenAddress);
      console.log(filteredData);

      let curMintedToken = BigInt(0);
      const sp = stepPrices800();

      const newChartData: BarData[] = [];

      if (filteredData.length == 0) {
        // 거래 내역이 없을 경우 기본 데이터 추가
        newChartData.push({
          time: Math.floor(Date.now() / 1000) as UTCTimestamp,
          open: 0.000002125,
          high: 0.000002125,
          low: 0.000002125,
          close: 0.000002125,
        });
      }
      for (const event of filteredData) {
        const date = new Date(event.blockTimestamp);
        let timestamp = (Math.floor(date.getTime() / 1000) -
          9 * 60 * 60) as UTCTimestamp; // 한국 표준시 UTC로 변환하기 위해 마이너스

        // 동일한 타임스탬프를 가진 데이터 포인트가 있으면, 1초씩 증가시켜 유니크하게 만듭니다.
        while (newChartData.some((entry) => entry.time === timestamp)) {
          timestamp = (timestamp + 1) as UTCTimestamp;
        }

        if (event.isMint) {
          curMintedToken += BigInt(event.amountMinted!._hex);
        } else {
          curMintedToken -= BigInt(event.amountMinted!._hex);
        }

        const divValue = Math.floor(
          Number(curMintedToken / BigInt(1000000000000000000000000)),
        );

        if (divValue >= 0) {
          const newDataPoint = {
            time: timestamp,
            open:
              newChartData.length > 0
                ? newChartData[newChartData.length - 1].close
                : 0.000002125,
            high: Number(ethers.formatEther(sp[divValue])),
            low: Number(ethers.formatEther(sp[divValue])),
            close: Number(ethers.formatEther(sp[divValue])),
          };
          newChartData.push(newDataPoint);
        }
      }

      // 데이터가 시간 순서대로 정렬되어 있는지 확인
      newChartData.sort((a, b) => (a.time as number) - (b.time as number));

      // 시리즈 데이터 업데이트
      if (seriesRef.current) {
        seriesRef.current.setData(newChartData);
      }

      // chartData 상태 업데이트
      setChartData(newChartData);

      if (newChartData.length >= 1) {
        setGetOnce(true);
      }

      setReady(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAndUpdateData();
  }, [getOnce, tokenAddress]);

  useEffect(() => {
    console.log(JSON.stringify(chartData, null, 2) + "chartdata");
    if (chartData.length === 0) return;
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
            return `${date.getUTCHours().toString().padStart(2, "0")}:${date
              .getUTCMinutes()
              .toString()
              .padStart(2, "0")}:${date
              .getUTCSeconds()
              .toString()
              .padStart(2, "0")}`;
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

      // Update data every 3 seconds
      const intervalId = setInterval(fetchAndUpdateData, 3000);

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
