<script setup>
import Home from '@/components/Home/Home.vue';
import Background from '@/components/Home/Background.vue';
</script>
<template>
  <div
    class="container w-full max-w-full max-h-screen min-h-screen px-8 mx-auto bg-white lg:px-20 dark:bg-surface-900/50 isolate">
    <Background />
    <Home />
    <Content />
  </div>
</template>
