<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
    <main class="bg-bg min-h-screen">
        <div class="max-w-[900px] mx-auto px-10 max-md:px-5 flex flex-col">
            <Header />
            <RouterView />
            <Footer />
        </div>
    </main>
</template>
