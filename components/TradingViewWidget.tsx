import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  ISeriesApi,
  UTCTimestamp,
  BarData,
} from "lightweight-charts";

const TradingViewChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<BarData[]>([
    {
      time: 1672531200 as UTCTimestamp,
      open: 50,
      high: 55,
      low: 48,
      close: 54,
    }, // 2023-01-01 00:00:00
    {
      time: 1672531260 as UTCTimestamp,
      open: 54,
      high: 57,
      low: 52,
      close: 56,
    }, // 2023-01-01 00:01:00
    {
      time: 1672531320 as UTCTimestamp,
      open: 56,
      high: 58,
      low: 53,
      close: 57,
    }, // 2023-01-01 00:02:00
    {
      time: 1672531380 as UTCTimestamp,
      open: 57,
      high: 59,
      low: 55,
      close: 58,
    }, // 2023-01-01 00:03:00
    {
      time: 1672531440 as UTCTimestamp,
      open: 58,
      high: 60,
      low: 56,
      close: 59,
    }, // 2023-01-01 00:04:00
    {
      time: 1672531500 as UTCTimestamp,
      open: 59,
      high: 61,
      low: 57,
      close: 60,
    }, // 2023-01-01 00:05:00
    {
      time: 1672531560 as UTCTimestamp,
      open: 60,
      high: 62,
      low: 58,
      close: 61,
    }, // 2023-01-01 00:06:00
    {
      time: 1672531620 as UTCTimestamp,
      open: 61,
      high: 63,
      low: 59,
      close: 62,
    }, // 2023-01-01 00:07:00
    {
      time: 1672531680 as UTCTimestamp,
      open: 62,
      high: 64,
      low: 60,
      close: 63,
    }, // 2023-01-01 00:08:00
    {
      time: 1672531740 as UTCTimestamp,
      open: 63,
      high: 65,
      low: 61,
      close: 64,
    }, // 2023-01-01 00:09:00
    {
      time: 1672531800 as UTCTimestamp,
      open: 64,
      high: 66,
      low: 62,
      close: 65,
    }, // 2023-01-01 00:10:00
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
            //u can delete seconds later
          },
        },
      });

      const candlestickSeries: ISeriesApi<"Candlestick"> =
        chart.addCandlestickSeries();
      candlestickSeries.setData(chartData);

      // Update data every second
      const secondIntervalId = setInterval(() => {
        setChartData((prevData) => {
          const lastDataPoint = prevData[prevData.length - 1];
          const updatedDataPoint: BarData = {
            ...lastDataPoint,
            high: Math.max(
              lastDataPoint.high,
              lastDataPoint.close + Math.random(),
            ),
            low: Math.min(
              lastDataPoint.low,
              lastDataPoint.close - Math.random(),
            ),
            close: lastDataPoint.close + (Math.random() - 0.5),
          };
          candlestickSeries.update(updatedDataPoint);
          const newData = [...prevData.slice(0, -1), updatedDataPoint];
          return newData;
        });
      }, 1000); // Update every second

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
      }, 5000); // Add new candle every 5 seconds

      return () => {
        clearInterval(secondIntervalId);
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
