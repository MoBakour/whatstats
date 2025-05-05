<script setup lang="ts">
import { computed, ref } from "vue";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as ChartTitle,
    BarElement,
} from "chart.js";
import { Pie, Line, Bar } from "vue-chartjs";
import { Message, TimeSeriesData } from "../composables/useProcess";
import Title from "./Title.vue";

// Register Chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartTitle,
    BarElement
);

// Define props for the component
const props = defineProps<{
    messages: Message[];
    getSenderFrequency: () => Record<string, number>;
    getTopSenders: (limit?: number) => { sender: string; count: number }[];
    getTimeSeriesData: (
        interval?: "day" | "week" | "month"
    ) => TimeSeriesData[];
    getMessageCountByHour: () => number[];
}>();

// Time interval selection
const selectedTimeInterval = ref<"day" | "week" | "month">("day");
const timeIntervalOptions = [
    { label: "Daily", value: "day" },
    { label: "Weekly", value: "week" },
    { label: "Monthly", value: "month" },
];

// Top senders selection
const selectedTopSendersLimit = ref<number | "ALL">(7);
const topSendersOptions = [
    { label: "Top 3", value: 3 },
    { label: "Top 5", value: 5 },
    { label: "Top 7", value: 7 },
    { label: "Top 10", value: 10 },
    { label: "ALL", value: "ALL" },
];

// Chart data
const senderChartData = computed(() => {
    const topSenders =
        selectedTopSendersLimit.value === "ALL"
            ? props.getTopSenders()
            : props.getTopSenders(selectedTopSendersLimit.value);
    return {
        labels: topSenders.map((item) => item.sender),
        datasets: [
            {
                label: "Messages",
                data: topSenders.map((item) => item.count),
                backgroundColor: [
                    "#25d366",
                    "#128C7E",
                    "#075E54",
                    "#34B7F1",
                    "#ECE5DD",
                    "#DCF8C6",
                    "#FF0000",
                ],
                hoverOffset: 4,
            },
        ],
    };
});

const timeSeriesChartData = computed(() => {
    const data = props.getTimeSeriesData(selectedTimeInterval.value);
    return {
        labels: data.map((item) => item.date),
        datasets: [
            {
                label: "Message Count",
                data: data.map((item) => item.count),
                borderColor: "#25d366",
                backgroundColor: "rgba(37, 211, 102, 0.2)",
                tension: 0.1,
                fill: true,
            },
        ],
    };
});

const hourlyActivityChartData = computed(() => {
    const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const hourData = props.getMessageCountByHour();

    return {
        labels: hourLabels,
        datasets: [
            {
                label: "Messages per hour",
                data: hourData,
                backgroundColor: "rgba(37, 211, 102, 0.7)",
            },
        ],
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
};

const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: "right",
            labels: {
                color: "white",
            },
        },
    },
};

const lineChartOptions = {
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
</script>

<template>
    <section
        class="relative p-6 max-sm:p-4 flex flex-col justify-center gap-10"
        v-if="messages.length > 0"
    >
        <Title :title="'Results'" />

        <div class="px-10 max-md:px-0">
            <!-- Basic stats -->
            <div class="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-white">
                <h2 class="text-text font-bold text-xl mb-2">
                    Here is a quick summary
                </h2>
                <p>
                    Your chat consists of
                    <span class="text-text font-bold">{{
                        messages.length
                    }}</span>
                    messages
                </p>
                <p>
                    Sent by
                    <span class="text-text font-bold"
                        >{{ Object.keys(getSenderFrequency()).length }}
                    </span>
                    members
                </p>
            </div>

            <!-- Top senders pie chart -->
            <div
                class="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-white mt-6"
            >
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-text font-bold text-xl">
                        Top Message Senders
                    </h2>
                    <select
                        v-model="selectedTopSendersLimit"
                        class="bg-gray-700 text-white rounded px-3 py-1"
                    >
                        <option
                            v-for="option in topSendersOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </option>
                    </select>
                </div>
                <div class="h-80">
                    <Pie :data="senderChartData" :options="pieChartOptions" />
                </div>
            </div>

            <!-- Time series chart -->
            <div
                class="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-white mt-6"
            >
                <div
                    class="flex justify-between items-center mb-4 max-sm:flex-col max-sm:gap-2 max-sm:items-start"
                >
                    <h2 class="text-text font-bold text-xl">
                        Message Activity Over Time
                    </h2>
                    <div class="flex gap-2">
                        <button
                            v-for="option in timeIntervalOptions"
                            :key="option.value"
                            @click="selectedTimeInterval = option.value"
                            class="px-3 py-1 rounded text-sm"
                            :class="[
                                selectedTimeInterval === option.value
                                    ? 'bg-text text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 transition cursor-pointer',
                            ]"
                        >
                            {{ option.label }}
                        </button>
                    </div>
                </div>
                <div class="h-80">
                    <Line
                        :data="timeSeriesChartData"
                        :options="lineChartOptions"
                    />
                </div>
            </div>

            <!-- Hourly activity chart -->
            <div
                class="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-white mt-6"
            >
                <h2 class="text-text font-bold text-xl mb-4">
                    Hourly Message Distribution
                </h2>
                <div class="h-60">
                    <Bar
                        :data="hourlyActivityChartData"
                        :options="lineChartOptions"
                    />
                </div>
                <p class="mt-2 text-sm text-center text-gray-400">
                    Hour of day (24-hour format)
                </p>
            </div>
        </div>
    </section>
</template>
