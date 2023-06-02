import React, { useState, useEffect } from 'react';
import { ChartCanvas, Chart } from 'react-financial-charts';
import { CandlestickSeries } from 'react-financial-charts/lib';
import { XAxis, YAxis } from 'react-financial-charts/lib';
import { discontinuousTimeScaleProvider } from 'react-financial-charts/lib';

const CandlestickChart = ({ data, width, height, interval, from, to, onIntervalChange, onFromChange, onToChange }) => {
  const handleIntervalChange = (e) => {
    onIntervalChange(e.target.value);
  };

  const handleFromChange = (e) => {
    onFromChange(e.target.value);
  };

  const handleToChange = (e) => {
    onToChange(e.target.value);
  };

  // Configure the x-scale provider
  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => new Date(d.date)
  );
  const { data: xData, xScale, xAccessor, displayXAccessor } = xScaleProvider(data);

  return (
      <div>
        <div>
          <label>
            Interval:
            <select value={interval} onChange={handleIntervalChange}>
              <option value="1d">Day</option>
              <option value="1wk">Week</option>
              <option value="1mo">Month</option>
            </select>
          </label>
          <label>
            From:
            <input type="datetime-local" value={from} onChange={handleFromChange} />
          </label>
          <label>
            To:
            <input type="datetime-local" value={to} onChange={handleToChange} />
          </label>
        </div>
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
  const [interval, setInterval] = useState('1d');
  const [from, setFrom] = useState('2021-10-04T09:00');
  const [to, setTo] = useState('2022-01-29T16:13');

  useEffect(() => {
    fetchData();
  }, [interval, from, to]);

  const fetchData = async () => {
    try {
      // Fetch data from API with the selected interval, from, and to dates
      const response = await fetch(`http://localhost:3001/api/yahoo-finance?interval=${interval}&period1=${new Date(from).getTime() / 1000}&period2=${new Date(to).getTime() / 1000}&events=history&crumb=5YTX%2FgVGBmg`);
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleIntervalChange = (selectedInterval) => {
    setInterval(selectedInterval);
  };

  const handleFromChange = (selectedFrom) => {
    setFrom(selectedFrom);
  };

  const handleToChange = (selectedTo) => {
    setTo(selectedTo);
  };

  return (
      <div>
        <h1>Candlestick Chart</h1>
        {data.length > 0 ? (
            <CandlestickChart
                data={data}
                width={1600}
                height={750}
                interval={interval}
                from={from}
                to={to}
                onIntervalChange={handleIntervalChange}
                onFromChange={handleFromChange}
                onToChange={handleToChange}
            />
        ) : (
            <p>Loading data...</p>
        )}
      </div>
  );
};

export default CandlestickChartPage;
