<script setup>
const props = defineProps({
  item: Object,
  entry: String,
});

const { isActiveLink } = useSidebarControl(computed(() => props.item));

const currentLink = computed(() => {
  return isActiveLink.value || props.item.link === props.entry;
});
</script>

<template>
  <a
    :href="item.link"
    class="flex items-start py-1 pl-4 text-sm border-l"
    :class="[
      currentLink
        ? 'text-primary-500 border-primary-500 focus:text-primary-500 focus:border-primary-500 dark:text-primary-500 dark:border-primary-500'
        : 'text-surface-700 border-surface-300/50 hover:text-surface-800 hover:border-primary-500 dark:text-surface-400 dark:border-surface-800 dark:hover:text-surface-500 dark:hover:border-surface-500 dark:focus:text-primary-500 dark:focus:border-primary-500',
    ]">
    {{ item.text }}
  </a>
</template>
