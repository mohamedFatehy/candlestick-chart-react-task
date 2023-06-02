import React, { useState, useEffect } from 'react';
import { ChartCanvas, Chart } from 'react-financial-charts';
import { CandlestickSeries } from 'react-financial-charts/lib';
import { XAxis, YAxis } from 'react-financial-charts/lib';
import { discontinuousTimeScaleProvider } from 'react-financial-charts/lib';

const CandlestickChart = ({ data, width, height, interval, from, to }) => {

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
    try {
      // Fetch data from API with the selected interval, from, and to dates
      const response = await fetch(`http://localhost:3001/api/yahoo-finance?period1=1633381200&period2=1664917199&interval=1d&events=history&crumb=5YTX%2FgVGBmg `);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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
