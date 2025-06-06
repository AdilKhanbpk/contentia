"use client";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Props as ChartProps } from "react-apexcharts";

interface OrdersCardChartProps {
    ordersByMonth: number[];
}

const OrdersCardChart: React.FC<OrdersCardChartProps> = ({ ordersByMonth }) => {
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
        plotOptions: {
            bar: {
                borderRadius: 0,
            },
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
        },
        grid: {
            show: false,
        },
    };

    const [options, setOptions] = useState<ChartProps>(areaChartOptions);

    const [series] = useState([
        {
            name: "Orders",
            data: ordersByMonth,
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

export default OrdersCardChart;
