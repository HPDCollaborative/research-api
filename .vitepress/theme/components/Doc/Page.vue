<script setup>
import AsideOutline from '@/components/Doc/AsideOutline.vue';
import PrevNext from '@/components/Doc/PageFooter.vue';

const { page, theme } = useData();

const shouldShowOutline = computed(() => {
  return page.value.frontmatter.hasOwnProperty('outline') ? page.value.frontmatter.outline : true;
});

const shouldShowPrevNext = computed(() => {
  const sidebar = theme.value.sidebar;
  for (const path in sidebar) {
    if (Array.isArray(sidebar[path])) {
      for (const block of sidebar[path]) {
        if (block.items && Array.isArray(block.items) && block.items.length > 1) {
          return true;
        }
      }
    }
  }
  return false;
});
</script>
<template>
  <div
    class="grid grid-cols-noline xl:grid-cols-outline grid-rows-content lg:border-l border-surface-200 dark:border-surface-700">
    <div class="z-10 col-start-1 col-end-2 row-start-1 row-end-2 px-10 py-10 prose max-w-none dark:prose-invert">
      <Content />
    </div>
    <div class="col-start-2 col-end-3 row-start-1 row-end-3 px-8">
      <template v-if="shouldShowOutline">
        <AsideOutline />
      </template>
    </div>
    <div class="col-start-1 col-end-2 row-start-2 row-end-3">
      <PrevNext v-if="shouldShowPrevNext" />
    </div>
  </div>
</template>
