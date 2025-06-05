import { Chart as ChartJS } from "chart.js";

export type TimeInterval = "day" | "week" | "month";

export interface Message {
    sender: string;
    message: string;
    timestamp: Date;
}

export interface TimeSeriesData {
    date: string;
    count: number;
}

export const timeIntervalOptions: { label: string; value: TimeInterval }[] = [
    { label: "Daily", value: "day" },
    { label: "Weekly", value: "week" },
    { label: "Monthly", value: "month" },
];

export const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "right" as const,
            labels: {
                color: "white",
                generateLabels(chart: ChartJS) {
                    const allLabels =
                        ChartJS.overrides.pie.plugins.legend.labels.generateLabels(
                            chart
                        );
                    return allLabels.slice(0, 14); // Limit to 14
                },
            },
        },
    },
    animation: {
        animateRotate: true,
        animateScale: true,
    },
};

export const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                color: "white",
                maxRotation: 45,
                minRotation: 45,
            },
            grid: {
                color: "rgba(255, 255, 255, 0.1)",
            },
        },
        y: {
            ticks: {
                color: "white",
            },
            grid: {
                color: "rgba(255, 255, 255, 0.1)",
            },
        },
    },
    plugins: {
        legend: {
            labels: {
                color: "white",
            },
        },
        tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
        },
    },
};
