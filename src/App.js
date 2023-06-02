import React, { useState, useEffect } from 'react';
import { ChartCanvas, Chart } from 'react-financial-charts';
import { CandlestickSeries } from 'react-financial-charts/lib';
import { XAxis, YAxis } from 'react-financial-charts/lib';
import { discontinuousTimeScaleProvider } from 'react-financial-charts/lib';

const CandlestickChart = ({ data, width, height, interval, from, to }) => {
  // Configure the x-scale provider
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => new Date(d.date)
  );
  const { data: xData, xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

  return (
      <div>
        <ChartCanvas
            width={width}
            height={height}
            ratio={window.devicePixelRatio}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            seriesName="Price"
            data={xData}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
        >
          <Chart id={1} yExtents={(d) => [d.high, d.low]}>
            <XAxis axisAt="bottom" orient="bottom" ticks={6} />
            <YAxis axisAt="left" orient="left" />
            <CandlestickSeries />
          </Chart>
        </ChartCanvas>
      </div>
  );
};

const CandlestickChartPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setData([
      { date: new Date(2022, 0, 1), open: 100, high: 120, low: 80, close: 110, volume: 1000 },
      { date: new Date(2022, 0, 2), open: 110, high: 130, low: 90, close: 120, volume: 1500 },
      { date: new Date(2022, 0, 3), open: 120, high: 140, low: 100, close: 130, volume: 2000 },
      // Add more data points as needed
    ]);
  };

  const handleIntervalChange = (selectedInterval) => {
    setInterval(selectedInterval);
  };


  return (
      <div>
        <h1>Candlestick Chart</h1>
        {data.length > 0 ? (
            <CandlestickChart
                data={data}
                width={1600}
                height={750}
                onIntervalChange={handleIntervalChange}
            />
        ) : (
            <p>Loading data...</p>
        )}
      </div>
  );
};

export default CandlestickChartPage;
