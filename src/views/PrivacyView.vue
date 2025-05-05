<script setup lang="ts">
import Title from "../components/Title.vue";
</script>

<template>
    <div class="relative mx-auto p-6 max-w-4xl">
        <Title title="Privacy" />

        <div class="bg-background-light p-6">
            <h2 class="text-2xl font-semibold text-text mb-4">
                Our Privacy Commitment
            </h2>
            <p class="text-white mb-4">
                WhatStats takes your privacy extremely seriously. Our core
                principle is to provide useful analytics while ensuring your
                personal conversations remain completely private.
            </p>

            <div
                class="border-l-4 border-primary bg-background-lighter p-4 my-6"
            >
                <p class="text-white font-semibold">
                    Your uploaded chat files are never saved on our servers or
                    transmitted to any third parties. All data processing
                    happens entirely within your browser, on your own device.
                </p>
            </div>

            <h2 class="text-2xl font-semibold text-text mb-4 mt-8">
                How We Handle Your Data
            </h2>
            <ul class="list-disc list-inside space-y-2 text-white mb-6">
                <li>Your chat history is processed locally in your browser</li>
                <li>
                    No data is ever sent to our servers or any external service
                </li>
                <li>
                    Once you close or refresh the page, all uploaded data is
                    automatically discarded
                </li>
                <li>
                    We use no tracking cookies or analytics tools that could
                    compromise your privacy
                </li>
            </ul>

            <h2 class="text-2xl font-semibold text-text mb-4 mt-8">
                Technical Implementation
            </h2>
            <p class="text-white mb-4">
                WhatStats is built as a client-side application that runs
                entirely in your web browser. When you upload a chat file, the
                parsing, processing, and visualization all happen locally on
                your device using JavaScript. The file never leaves your browser
                environment, and no data is transmitted over the internet.
            </p>

            <h2 class="text-2xl font-semibold text-text mb-4 mt-8">
                Contact Information
            </h2>
            <p class="text-white mb-4">
                If you have any questions or concerns about our privacy
                practices, please contact us at:
                <a href="mailto:mo.bakour@outlook.com" class="underline"
                    >mo.bakour@outlook.com</a
                >
            </p>

            <div class="mt-8 pt-4 border-t border-gray-300">
                <p class="text-sm text-gray-500">Last updated: May 5, 2025</p>
            </div>
        </div>
    </div>
</template>
