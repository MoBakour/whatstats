<script setup lang="ts">
import { ref } from "vue";
import { Upload } from "lucide-vue-next";
import Title from "./Title.vue";

// Props and emits for passing data with parent
const props = defineProps<{
    isProcessing: boolean;
}>();

const emit = defineEmits<{
    "process-file": [file: File | null];
}>();

const isDragging = ref(false);

const handleDrop = (event: DragEvent) => {
    isDragging.value = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "text/plain") {
            emit("process-file", file);
        } else {
            alert("Only .txt files are allowed.");
        }
    }
};

const handleDragOver = () => {
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleFileInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "text/plain") {
            emit("process-file", file);
        } else {
            alert("Only .txt files are allowed.");
        }
    }
};
</script>

<template>
    <section
        class="relative p-6 max-sm:p-4 flex flex-col justify-center gap-10"
    >
        <Title :title="'Upload'" />

        <div class="px-10 max-md:px-0">
            <form>
                <!-- drag and drop box -->
                <label
                    class="w-full border-2 border-dashed border-gray-400 rounded-lg px-6 py-10 cursor-pointer text-white font-medium opacity-40 flex flex-col items-center justify-center gap-2 hover:opacity-70 transition-opacity"
                    for="fileInput"
                    :class="{ 'bg-gray-100': isDragging }"
                    @dragover.prevent="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop.prevent="handleDrop"
                >
                    <Upload class="inline-block mr-2 w-[24px]" />
                    <p class="text-center">
                        Drag and drop files here, or click to upload
                    </p>
                </label>

                <!-- hidden file input -->
                <input
                    id="fileInput"
                    type="file"
                    class="hidden"
                    accept=".txt"
                    @change="handleFileInput"
                    :disabled="props.isProcessing"
                />
            </form>
        </div>
    </section>
</template>
