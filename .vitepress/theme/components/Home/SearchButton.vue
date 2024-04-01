<script setup>
const { theme } = useData();

const buttonText = computed(() => {
  const options = theme.value.search?.options;
  return options.placeholder || 'Search ...';
});

const metaKey = ref(`'Meta'`);

onMounted(() => {
  if (navigator.userAgentData) {
    // New User-Agent Client Hints API
    navigator.userAgentData.getHighEntropyValues(['platform']).then((ua) => {
      metaKey.value = /Mac|iPhone|iPod|iPad/i.test(ua.platform) ? '⌘' : 'Ctrl';
    });
  } else {
    // Fallback for older browsers
    metaKey.value = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent) ? '⌘' : 'Ctrl';
  }
});
</script>

<template>
  <div class="relative pointer-events-auto w-60">
    <button
      class="flex items-center w-full py-2 pl-3 pr-4 text-sm leading-6 transition-colors duration-500 rounded-full shadow-sm bg-surface-200 text-surface-700 focus:outline-none dark:text-surface-300 hover:bg-surface-100 dark:bg-black dark:hover:bg-surface-700">
      <i class="icon-[heroicons--magnifying-glass] flex-none w-4 h-4 mr-3" />
      <span>{{ buttonText }}</span>
      <kbd class="flex-none pl-3 ml-auto font-sans text-xs font-semibold">
        {{ metaKey }}K <span class="text-xs">/</span>
      </kbd>
    </button>
  </div>
</template>
