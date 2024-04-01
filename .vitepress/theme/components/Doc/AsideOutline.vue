<script setup>
import AsideItem from '@/components/Doc/AsideItem.vue';
import { onContentUpdated } from 'vitepress';

const headers = shallowRef([]);

onContentUpdated(() => {
  headers.value = getHeaders();
});

const container = ref();

useActiveAnchor(container);
</script>

<template>
  <nav class="fixed mt-10 w-64 px-2 top-[3.3rem] aside" ref="container">
    <ul class="py-1 border-l-2 dark:border-surface-700">
      <h2 class="pt-1 pl-3 text-sm font-medium uppercase text-surface-600 aside-header dark:text-surface-400">
        On this page
      </h2>
      <AsideItem :headers="headers" />
    </ul>
  </nav>
</template>
