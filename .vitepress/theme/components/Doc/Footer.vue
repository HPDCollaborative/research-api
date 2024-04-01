<script setup>
const { theme } = useData();

const copyright = theme.value.copyright;

const date = new Date();
const year = date.getFullYear();
</script>
<template>
  <footer
    class="bottom-0 z-50 w-full px-8 py-2 text-sm text-center border-t border-l text-surface-500 lg:text-left border-surface-200 dark:bg-surface-800 dark:border-surface-700">
    &copy;{{ year }}. {{ copyright }}. All Rights Reserved.
  </footer>
</template>
