<script setup lang="ts">
defineProps({
    title: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <!-- edge decoration -->
    <div
        class="absolute top-0 left-0 h-[5px] w-[80px] max-sm:h-[4px] max-sm:w-[60px] bg-text rounded-full"
    />
    <div
        class="absolute top-0 left-0 h-[80px] w-[5px] max-sm:h-[60px] max-sm:w-[4px] bg-text rounded-full"
    />

    <h1 class="text-4xl max-sm:text-3xl font-bold tracking-widest text-text">
        <span class="text-5xl max-sm:text-4xl">{{ title[0] }}</span
        >{{ title.slice(1) }}
    </h1>
</template>
