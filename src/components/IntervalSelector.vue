<script setup lang="ts">
import { type TimeInterval, timeIntervalOptions } from "../utils/constants";

const props = defineProps<{
    selectedInterval: TimeInterval;
}>();

const emit = defineEmits<{
    (e: "update:selectedInterval", value: TimeInterval): void;
}>();
</script>

<template>
    <div class="flex items-center gap-2">
        <button
            v-for="option in timeIntervalOptions"
            :key="option.value"
            @click="
                emit('update:selectedInterval', option.value as TimeInterval)
            "
            class="px-3 py-1 rounded text-sm"
            :class="[
                props.selectedInterval === option.value
                    ? 'bg-text text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 transition cursor-pointer',
            ]"
        >
            {{ option.label }}
        </button>
    </div>
</template>
