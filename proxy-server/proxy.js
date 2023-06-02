const express = require('express');
const axios = require('axios');
const csv = require('csvtojson');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/yahoo-finance', async (req, res) => {
    const url = 'https://query1.finance.yahoo.com/v7/finance/download/SPUS';
    const { period1, period2, interval, events, crumb } = req.query;

    try {
        const response = await axios.get(url, {
            params: {
                period1,
                period2,
                interval,
                events,
                crumb
            },
            responseType: 'text' // Get the response as text
        });

        const csvData = response.data;
        const jsonData = await csv().fromString(csvData); // Convert CSV to JSON

        const transformedData = jsonData.map((item) => ({
            date: item.Date,
            open: parseFloat(item.Open),
            high: parseFloat(item.High),
            low: parseFloat(item.Low),
            close: parseFloat(item.Close),
            volume: parseInt(item.Volume),
        }));

        res.json(transformedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data from Yahoo Finance API' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server is running on http://localhost:${port}`);
});
