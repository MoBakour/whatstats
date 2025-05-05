<script setup lang="ts">
import Title from "../components/Title.vue";
</script>

<template>
    <div class="relative mx-auto p-6 max-w-4xl">
        <Title title="About" />

        <div class="bg-background-light p-6">
            <h2 class="text-2xl font-semibold text-text mb-4">
                What is WhatStats?
            </h2>
            <p class="text-white mb-4">
                Hi, I'm Mohamed Bakour, the creator of WhatStats. This tool is a
                passion project of mine, designed to help you analyze and
                visualize your WhatsApp chat history while keeping your privacy
                intact. My goal is to provide you with meaningful insights into
                your conversations without ever compromising your data security.
            </p>

            <h2 class="text-2xl font-semibold text-text mb-4 mt-8">
                How it works
            </h2>
            <ol class="list-decimal list-inside space-y-2 text-white mb-6">
                <li>Export your WhatsApp chat history (without media)</li>
                <li>Upload the file to WhatStats</li>
                <li>
                    Instantly explore detailed analysis and visualizations of
                    your conversation patterns
                </li>
            </ol>
            <p class="text-white mb-4">
                Everything happens directly in your browser. Your chat history
                never leaves your device, ensuring complete privacy.
            </p>

            <h2 class="text-2xl font-semibold text-text mb-4 mt-8">
                My mission
            </h2>
            <p class="text-white mb-4">
                As someone passionate about technology and privacy, I created
                WhatStats to empower people to gain insights from their digital
                conversations without sacrificing their privacy. My mission is
                to combine powerful analytics with the highest standards of data
                security, so you can trust that your information is safe.
            </p>

            <h2 class="text-2xl font-semibold text-text mb-4 mt-8">
                Contact me
            </h2>
            <p class="text-white">
                Have questions, feedback, or just want to say hi? I'd love to
                hear from you! Feel free to reach out to me at
                <a href="mailto:mo.bakour@outlook.com" class="underline"
                    >mo.bakour@outlook.com</a
                >
            </p>
        </div>
    </div>
</template>
