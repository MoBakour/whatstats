<script setup lang="ts">
import { Github, Linkedin, Link } from "lucide-vue-next";
</script>

<template>
    <footer
        class="pb-4 pt-10 flex justify-center items-center gap-10 max-xs:flex-col-reverse max-xs:gap-4"
    >
        <p class="text-center text-white text-sm">
            &copy; {{ new Date().getFullYear() }} MoBakour. All rights reserved.
        </p>

        <div class="flex gap-3">
            <a
                href="https://github.com/MoBakour/whatstats"
                target="_blank"
                class="cursor-pointer transition hover:opacity-70"
                title="GitHub Repository"
            >
                <Github class="text-white w-[20px]"
            /></a>
            <a
                href="https://linkedin.com/in/mobakour/"
                target="_blank"
                class="cursor-pointer transition hover:opacity-70"
                title="LinkedIn Profile"
            >
                <Linkedin class="text-white w-[20px]" />
            </a>
            <a
                href="https://bakour.dev"
                target="_blank"
                class="cursor-pointer transition hover:opacity-70"
                title="My Portfolio"
            >
                <Link class="text-white w-[20px]" />
            </a>
        </div>

        <div class="flex justify-center items-center gap-3">
            <router-link
                to="/about"
                class="text-white text-sm transition hover:opacity-70 cursor-pointer"
            >
                About
            </router-link>

            <div class="w-[4px] h-[4px] bg-white rounded-full" />

            <router-link
                to="/privacy"
                class="text-white text-sm transition hover:opacity-70 cursor-pointer"
            >
                Privacy Policy
            </router-link>
        </div>
    </footer>
</template>
