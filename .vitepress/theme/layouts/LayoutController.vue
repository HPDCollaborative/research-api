<script setup>
import DocLayout from '@/components/Doc/Layout.vue';
import HomeLayout from '@/components/Home/Layout.vue';
//import PageLayout from '@/components/Page/Layout.vue';

const { frontmatter } = useData();

const LayoutComponent = computed(() => {
  switch (frontmatter.value.layout) {
    case 'home':
      return HomeLayout;
    // case 'page':
    //   return PageLayout;
    default:
      return DocLayout;
  }
});
</script>

<template>
  <component :is="LayoutComponent" />
</template>
