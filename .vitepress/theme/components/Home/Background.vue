<script setup>
import PatternDark from '@/components/Home/PatternDark.vue';
import PatternLight from '@/components/Home/PatternLight.vue';

const isDark = useDark();

const BackgroundComponent = computed(() => {
  return isDark.value ? PatternDark : PatternLight;
});
</script>
<template>
  <component :is="BackgroundComponent" />
</template>
