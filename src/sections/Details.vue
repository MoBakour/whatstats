<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "../utils/utils";
import { ArrowLeft } from "lucide-vue-next";
import {
    type TimeInterval,
    type TimeSeriesData,
    lineChartOptions,
} from "../utils/constants";
import IntervalSelector from "../components/IntervalSelector.vue";
import { Line } from "vue-chartjs";

const props = defineProps<{
    senders: [string, number][];
    pieChartDetails: boolean;
    getTimeSeriesData: (
        interval?: TimeInterval,
        sender?: string | null
    ) => TimeSeriesData[];
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const searchQuery = ref("");
const selectedInterval = ref<TimeInterval>("month");
const senderDetails = ref<string | null>(null);

const filteredSenders = computed(() => {
    if (searchQuery.value === "") return props.senders;

    return props.senders.filter((sender: [string, number]) =>
        sender[0]
            .toLowerCase()
            .trim()
            .includes(searchQuery.value.toLowerCase().trim())
    );
});

const handleClose = () => {
    emit("close");
    setTimeout(() => {
        searchQuery.value = "";
        senderDetails.value = null;
        selectedInterval.value = "month";
    }, 150);
};

const timeSeriesChartData = computed(() => {
    const data = props.getTimeSeriesData(
        selectedInterval.value,
        senderDetails.value
    );

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
</script>

<template>
    <!-- pie chart details -->
    <div
        @click.self="handleClose"
        class="fixed w-screen h-dvh inset-0 bg-black/70 flex items-center justify-center z-10 transition"
        :class="
            pieChartDetails
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
        "
    >
        <div
            class="scrollable bg-gray-800 p-6 pt-0 rounded-lg text-white w-11/12 max-w-2xl max-h-7/8 overflow-y-auto"
        >
            <!-- head -->
            <div
                class="sticky top-0 py-6 bg-gray-800 flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4"
            >
                <h2 class="text-text font-bold text-xl flex items-center">
                    <ArrowLeft
                        v-if="senderDetails"
                        class="cursor-pointer transition hover:opacity-70 mr-2 text-white max-xs:w-[20px]"
                        @click="senderDetails = null"
                    />

                    <span class="max-xs:text-sm">
                        {{
                            senderDetails
                                ? `${senderDetails} Messaging Trends`
                                : "Top Message Senders"
                        }}
                    </span>
                </h2>

                <!-- time interval -->
                <IntervalSelector
                    v-if="senderDetails"
                    :selectedInterval="selectedInterval"
                    @update:selectedInterval="selectedInterval = $event"
                />

                <!-- search -->
                <input
                    v-if="!senderDetails"
                    type="text"
                    placeholder="Search sender..."
                    class="p-2 bg-gray-700 text-white rounded max-sm:w-full"
                    v-model="searchQuery"
                />
            </div>

            <!-- list all senders and their messages count -->
            <div v-if="!senderDetails">
                <ul
                    v-if="filteredSenders.length > 0"
                    class="flex flex-col gap-2 mb-4"
                >
                    <li
                        v-for="[sender, count] in filteredSenders"
                        :key="sender"
                        class="flex justify-between items-center p-2 bg-gray-700 rounded cursor-pointer transition hover:opacity-80"
                        @click="senderDetails = sender"
                    >
                        <span>{{ sender }}</span>
                        <span class="text-text"
                            >{{ formatNumber(count) }} messages</span
                        >
                    </li>
                </ul>

                <!-- placeholder -->
                <p v-else class="opacity-40">No results found</p>
            </div>

            <!-- sender messages activity over time -->
            <div class="h-80" v-else>
                <Line :data="timeSeriesChartData" :options="lineChartOptions" />
            </div>

            <button
                class="absolute top-4 right-8 text-white text-5xl transition hover:opacity-70 cursor-pointer"
                @click="handleClose"
            >
                &times;
            </button>
        </div>
    </div>
</template>
