<script setup>
import ThemeSwitcher from '@/components/Doc/ThemeSwitcher.vue';
import Search from '@/components/Home/Search.vue';
import GitlabLink from '@/components/Doc/GitlabLink.vue';
import TwitterLink from '@/components/Doc/TwitterLink.vue';

const { theme } = useData();

const shouldShowGitlabLink = computed(() => theme.value.gitlabUrl != false);
const shouldShowTwitterLink = computed(() => theme.value.twitterUrl != false);
</script>

<template>
  <header class="bg-transparent w-full z-20 h-[3.3rem] flex-none">
    <div class="px-4 mx-auto h-[3.3rem] flex items-center justify-between">
      <div class="flex justify-start w-full">
        <ClientOnly>
          <Search />
        </ClientOnly>
      </div>
      <GitlabLink v-if="shouldShowGitlabLink" class="mr-4" />
      <TwitterLink v-if="shouldShowTwitterLink" class="mr-4" />
      <ThemeSwitcher />
    </div>
  </header>
</template>
