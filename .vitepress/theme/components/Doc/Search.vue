<script setup>
import SearchButton from '@/components/Doc/SearchButton.vue';

const SearchBox = computed(() => {
  return __VP_LOCAL_SEARCH__
    ? defineAsyncComponent(() => import('@/components/Doc/LocalSearchBox.vue'))
    : defineAsyncComponent(() => import('@/components/Doc/MeilisearchBox.vue'));
});

function isEditingContent(event) {
  const element = event.target;
  const tagName = element.tagName;
  return element.isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA';
}

const showSearch = ref(false);

onKeyStroke('k', (event) => {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();
    showSearch.value = true;
  }
});

onKeyStroke('/', (event) => {
  if (!isEditingContent(event)) {
    event.preventDefault();
    showSearch.value = true;
  }
});

const handleClose = () => {
  showSearch.value = false;
};
</script>

<template>
  <div class="ml-0">
    <SearchButton @click="showSearch = true" />
    <component :is="SearchBox" :open="showSearch" @close="handleClose" />
  </div>
</template>
