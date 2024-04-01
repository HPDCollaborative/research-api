<script setup>
defineProps({
  item: Object,
});
</script>

<template>
  <a
    :href="item.link"
    class="text-lg font-light transition-colors duration-500 text-surface-600 hover:text-primary-500 dark:text-surface-400 dark:hover:text-primary-500">
    {{ item.text }}
  </a>
</template>
