"use client";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Props as ChartProps } from "react-apexcharts";

const ReportChart = ({ sales }: { sales: { totalSalesByMonth: number[] } }) => {
    const [options, setOptions] = useState<ChartProps>({
        chart: {
            height: 340,
            type: "line",
            toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 1.5 },
        grid: { strokeDashArray: 4 },
        xaxis: {
            type: "datetime",
            categories: [], // will set dynamically
            labels: { format: "MMM" },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: { show: false },
        tooltip: {
            x: { format: "MMM" },
        },
    });

    const [series, setSeries] = useState([
        { name: "Income", data: sales.totalSalesByMonth },
    ]);
    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            xaxis: {
                ...prevState.xaxis,
                type: "category",
                categories: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                ],
            },
            tooltip: {
                ...prevState.tooltip,
                y: {
                    formatter(val: number) {
                        return `${val} TL`;
                    },
                },
            },
        }));

        setSeries([{ name: "Income", data: sales.totalSalesByMonth }]);
    }, [sales.totalSalesByMonth]);

    return (
        <ReactApexChart
            options={options}
            series={series}
            type='line'
            height={340}
        />
    );
};

export default ReportChart;
