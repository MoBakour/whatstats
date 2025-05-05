<script setup lang="ts">
import { ref } from "vue";
import Title from "./Title.vue";

const showImage = ref(false);

const handleShowImage = (status: boolean) => {
    showImage.value = status;
};
</script>

<template>
    <section class="relative p-6 max-sm:p-4 flex flex-col gap-6">
        <Title :title="'Guide'" />

        <!-- content -->
        <div
            class="flex justify-between items-center gap-3 max-sm:gap-6 px-10 max-md:px-0 max-sm:flex-col"
        >
            <!-- guide -->
            <div>
                <p class="text-white font-medium pl-4">Three simple steps:</p>

                <ul
                    class="text-white font-medium pl-6 flex flex-col gap-1 text-sm"
                >
                    <li>
                        <span>1. </span>
                        <span class="text-text">Export</span> WhatsApp chat
                        without media
                    </li>
                    <li>
                        <span>2. </span>
                        <span class="text-text">Upload</span> either the
                        <code>.zip</code> file or the
                        <code>_chat.txt</code> file
                    </li>
                    <li>
                        <span>3. </span>
                        <span class="text-text">View</span> your chat statistics
                        instantly
                    </li>
                </ul>
            </div>

            <!-- image -->
            <img
                src="/guide.jpg"
                class="w-[200px] rounded-lg cursor-pointer transition hover:scale-101"
                title="Click [Export Chat]"
                @click="handleShowImage(true)"
            />
        </div>
    </section>

    <div
        class="fixed inset-0 bg-black/70 flex items-center justify-center z-10 transition"
        :class="
            showImage
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
        "
        @click.self="handleShowImage(false)"
    >
        <img src="/guide.jpg" class="max-h-7/8 max-w-7/8 rounded-lg" />

        <button
            class="absolute top-4 right-8 text-white text-5xl transition hover:opacity-70 cursor-pointer"
            @click="handleShowImage(false)"
        >
            &times;
        </button>
    </div>
</template>
