<script setup>
const { theme } = useData();

const useBase = (path) => {
  return withBase(path);
};
</script>

<template>
  <a :href="useBase('/')" rel="canonical">
    <img
      v-bind="$attrs"
      class="block dark:hidden transition-all ease-linear duration-300 drop-shadow-[0_10px_10px_lch(var(--color-black)/0)] hover:drop-shadow-[0_10px_10px_lch(var(--color-black)/.80)]"
      :src="useBase(theme.logo.light)"
      alt="logo" />
    <img
      v-bind="$attrs"
      class="hidden dark:block transition-all ease-linear duration-300 dark:drop-shadow-[0_10px_10px_lch(var(--color-primary-500)/0)] dark:hover:drop-shadow-[0_10px_10px_lch(var(--color-primary-500)/.80)]"
      :src="useBase(theme.logo.dark)"
      alt="logo" />
  </a>
</template>
