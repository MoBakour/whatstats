<script setup lang="ts">
import { ref } from "vue";
import Results from "./Results.vue";
import Upload from "./Upload.vue";
import { useProcess } from "../composables/useProcess";

const uploadedFile = ref<File | null>(null);
const isProcessing = ref(false);
const {
    parseData,
    messages,
    getSenderFrequency,
    getTopSenders,
    getTimeSeriesData,
    getMessageCountByHourOfDay,
} = useProcess();

const processFile = async (file) => {
    if (!file) {
        alert("Please select a file first.");
        return;
    }

    uploadedFile.value = file;

    try {
        isProcessing.value = true;
        console.log("Starting processing:", uploadedFile.value.name);
        await parseData(uploadedFile.value);
        console.log(
            "Processing complete. Total messages:",
            messages.value.length
        );
    } catch (error) {
        console.error("Error processing file:", error);
        alert("There was an error processing the file. Please try again.");
    } finally {
        isProcessing.value = false;
    }
};
</script>

<template>
    <Results
        :messages="messages"
        :get-sender-frequency="getSenderFrequency"
        :get-top-senders="getTopSenders"
        :get-time-series-data="getTimeSeriesData"
        :get-message-count-by-hour="getMessageCountByHourOfDay"
    />

    <Upload
        :uploaded-file="uploadedFile"
        :is-processing="isProcessing"
        @process-file="processFile"
    />
</template>
