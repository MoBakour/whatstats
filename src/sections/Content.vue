<script setup lang="ts">
import { ref } from "vue";
import Results from "./Results.vue";
import Upload from "../components/Upload.vue";
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

const processFile = async (file: File | null) => {
    if (!file) {
        alert("Please select a file first.");
        return;
    }

    uploadedFile.value = file;

    try {
        isProcessing.value = true;
        await parseData(uploadedFile.value as File);
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
