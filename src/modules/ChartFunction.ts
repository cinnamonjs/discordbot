import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { ChartData, ChartConfiguration } from 'chart.js'
import { LogData } from '../type.js';

function getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export async function ChartStock(logdata: LogData[]): Promise<Buffer> {
    const width: number = 900;
    const height: number = 600;
    const backgroundColour = 'white'
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    // Fetch data, parse it, and prepare datasets
    const datasets = [];
    const labels = [];
    const stocks = {};

    logdata.forEach(log => {
        labels.push(log.index)
        log.stock.forEach(Stock => {
            if (!stocks[Stock.name]) {
                stocks[Stock.name] = [];
            }
            stocks[Stock.name].push(Stock.value);
        })
    })

    Object.keys(stocks).forEach(stockName => {
        datasets.push({
            label: stockName,
            data: stocks[stockName],
            borderColor: getRandomColor(),
            fill: false,
        });
    });

    const data: ChartData = {
        labels: labels,
        datasets: datasets
    };
    const configuration: ChartConfiguration = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,

            },
            plugins: {
                title: {
                    display: true,
                    text: 'Stock value'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Index",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Stock Value",
                    },
                },
            },
        },
    };
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    return image;
}

