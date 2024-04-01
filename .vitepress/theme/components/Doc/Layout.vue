<script setup>
import Page from '@/components/Doc/Page.vue';
import NotFound from '@/components/Doc/NotFound.vue';
import Sidebar from '@/components/Doc/Sidebar.vue';
import Header from '@/components/Doc/Header.vue';
import ScrollTop from '@/components/Doc/ScrollTop.vue';
import Logo from '@/components/Doc/Logo.vue';
import Footer from '@/components/Doc/Footer.vue';

const slug = ref('');

const router = useRouter();
const { site, page, theme } = useData();
const { updateVersionFromPath } = useVersion();
const defaultVersion = theme.value.defaults?.version;

// prettier-ignore
watch(() => router.route.path, (newPath) => {
  const path = newPath.split('/')[1];

  slug.value = path
    ? `/${path}/`
    : `/${defaultVersion}/`;

  updateVersionFromPath(newPath);
}, { immediate: true });
</script>
<template>
  <div class="grid min-h-dvh grid-cols-small lg:grid-cols-large grid-rows-layout">
    <div
      class="fixed inset-0 top-0 right-auto z-20 hidden col-start-1 col-end-2 row-start-1 row-end-4 px-5 pt-4 pb-10 overflow-y-auto bg-surface-200 dark:bg-surface-950 lg:block">
      <Logo class="flex-shrink-0 w-[248px] mb-6" :alt="site.title" width="248" height="67" />
      <Sidebar :version="slug" />
    </div>
    <div
      class="sticky top-0 z-30 col-start-2 col-end-3 row-start-1 row-end-2 backdrop-blur bg-white/80 dark:bg-surface-900/80">
      <Header :version="slug" />
    </div>
    <div class="relative col-start-2 col-end-3 row-start-2 row-end-3 bg-white dark:bg-surface-800">
      <NotFound v-if="page.isNotFound" />
      <Page v-else />
    </div>
    <div class="col-start-2 col-end-3 row-start-3 row-end-4">
      <Footer />
    </div>
  </div>

  <ScrollTop />
</template>
