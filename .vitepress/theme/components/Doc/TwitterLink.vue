<script setup>
const { theme } = useData();
const twitterUrl = computed(() => theme.value.twitterUrl);
</script>

<template>
  <a v-if="twitterUrl" :href="twitterUrl" target="_blank" rel="noopener noreferrer">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-auto duration-500 transition-color stroke-surface-500 hover:stroke-info-500 dark:stroke-surface-400 dark:hover:stroke-info-500">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
    </svg>
  </a>
</template>
