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
import type { Message, TimeSeriesData } from "../utils/constants";
import { Text } from "lucide-vue-next";
import Title from "../components/Title.vue";
import Details from "./Details.vue";
import { formatNumber, shuffle } from "../utils/utils";
import {
    type TimeInterval,
    lineChartOptions,
    pieChartOptions,
} from "../utils/constants";
import IntervalSelector from "../components/IntervalSelector.vue";

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
    getSenderFrequency: () => [string, number][];
    getTopSenders: (limit?: number) => { sender: string; count: number }[];
    getTimeSeriesData: (
        interval?: TimeInterval,
        sender?: string | null
    ) => TimeSeriesData[];
    getMessageCountByHour: () => number[];
}>();

const senders = computed(() => {
    return props.getSenderFrequency() || [];
});

const pieChartDetails = ref(false);

// Time interval selection
const selectedInterval = ref<TimeInterval>("month");

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
                backgroundColor: shuffle([
                    "#25D366",
                    "#1E4F43",
                    "#3B675C",
                    "#5B8F87",
                    "#6C7D73",
                    "#557C9B",
                    "#476D8A",
                    "#7C8F96",
                    "#A4B0A5",
                    "#938C6A",
                    "#8D6E63",
                    "#A67C82",
                    "#999C85",
                    "#B5C2B7",
                ]),
                hoverOffset: 4,
            },
        ],
    };
});

const timeSeriesChartData = computed(() => {
    const data = props.getTimeSeriesData(selectedInterval.value);
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
                        formatNumber(messages.length)
                    }}</span>
                    messages
                </p>
                <p>
                    Sent by
                    <span class="text-text font-bold"
                        >{{ formatNumber(senders.length) }}
                    </span>
                    members
                </p>
            </div>

            <!-- Top senders pie chart -->
            <div
                class="bg-gray-800 bg-opacity-50 p-4 rounded-lg text-white mt-6 flex flex-col gap-4"
            >
                <div class="flex justify-between items-center">
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
                <button
                    class="self-end text-text flex justify-center items-center gap-2 hover:opacity-70 transition cursor-pointer"
                    title="View More Details"
                    @click="pieChartDetails = true"
                >
                    <span>View Details</span>
                    <Text class="w-[18px]" />
                </button>
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

                    <IntervalSelector
                        :selectedInterval="selectedInterval"
                        @update:selectedInterval="selectedInterval = $event"
                    />
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

    <!-- pie chart details -->
    <Details
        :senders="senders"
        :pieChartDetails="pieChartDetails"
        :getTimeSeriesData="getTimeSeriesData"
        @close="pieChartDetails = false"
    />
</template>
