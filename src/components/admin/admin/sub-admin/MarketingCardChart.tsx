"use client";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Props as ChartProps } from "react-apexcharts";

interface MarketingCardChartProps {
    customersByMonth: number[];
}

const MarketingCardChart: React.FC<MarketingCardChartProps> = ({
    customersByMonth,
}) => {
    const areaChartOptions = {
        chart: {
            id: "new-stack-chart",
            sparkline: {
                enabled: true,
            },
            height: 100,
            type: "area",
            toolbar: {
                show: false,
            },
            offsetX: -1,
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
            crosshairs: {
                fill: {
                    type: "gradient",
                    gradient: {
                        colorFrom: "#D8E3F0",
                        colorTo: "#BED1E6",
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    },
                },
            },
            tooltip: {
                enabled: false,
            },
        },
        stroke: {
            curve: "straight",
            width: 1.5,
        },
        grid: {
            show: false,
        },
        yaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                formatter(val: number) {
                    return `$ ${val}`;
                },
            },
        },
    };

    const [options, setOptions] = useState<ChartProps>(areaChartOptions);

    const [series] = useState([
        {
            name: "Customers",
            data: customersByMonth,
        },
    ]);

    return (
        <ReactApexChart
            options={options}
            series={series}
            type='area'
            height={100}
        />
    );
};

export default MarketingCardChart;
