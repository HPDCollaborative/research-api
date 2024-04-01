<script setup>
import { onContentUpdated } from 'vitepress';
import VersionPicker from '@/components/Doc/VersionPicker.vue';
import ThemeSwitcher from '@/components/Doc/ThemeSwitcher.vue';
import Sidebar from '@/components/Doc/Sidebar.vue';
import GitHubLink from '@/components/Doc/GitHubLink.vue';
import GitlabLink from '@/components/Doc/GitlabLink.vue';
import TwitterLink from '@/components/Doc/TwitterLink.vue';
import HeaderLink from '@/components/Doc/HeaderLink.vue';
import Search from '@/components/Doc/Search.vue';

// @vueuse/core still uses v2 breakpoints
// replacing here with 3.4 values.
const breakpointsTailwind = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

const { theme } = useData();

const props = defineProps({
  version: {
    type: String,
    required: true,
  },
});

const menuVersion = computed(() => {
  return props.version || theme.value.defaults?.version;
});

const isOpen = ref(false);
const dotMenuOpen = ref(false);

onContentUpdated(() => {
  setIsOpen(false);
  setDotMenuOpen(false);
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const largerThanSm = breakpoints.greater('md');

useEventListener('resize', () => {
  if (largerThanSm.value) {
    setIsOpen(false);
    setDotMenuOpen(false);
  }
});

const versions = theme.value.versions;

const navItems = computed(() => theme.value.nav);
const shouldShowGitHubLink = computed(() => theme.value.githubUrl != false);
const shouldShowGitlabLink = computed(() => theme.value.gitlabUrl != false);
const shouldShowTwitterLink = computed(() => theme.value.twitterUrl != false);
const shouldShowNavItems = computed(() => theme.value.nav?.length > 0);
const shouldShowVersionPicker = computed(() => versions?.length > 1);

function setIsOpen(value) {
  isOpen.value = value;
}

function setDotMenuOpen(value) {
  dotMenuOpen.value = value;
}
</script>

<template>
  <header class="border-b w-full dark:border-surface-700 border-l border-surface-200 h-[3.3rem]">
    <div class="px-4 mx-auto h-[3.3rem]">
      <div class="flex items-center h-[3.3rem] gap-4">
        <button type="button" @click="setIsOpen(true)" class="text-surface-600 lg:hidden dark:text-surface-400">
          <span class="sr-only">Navigation</span>
          <i class="icon-[heroicons--bars-3] flex-shrink-0 w-6 h-6" />
        </button>

        <TransitionRoot :show="isOpen" as="template">
          <Dialog @close="setIsOpen" class="relative z-50">
            <div class="fixed inset-0 bg-white/25 dark:bg-surface-800/30 backdrop-blur" aria-hidden="true" />

            <div class="fixed inset-0 overflow-y-auto">
              <div class="flex min-h-full">
                <TransitionChild
                  as="template"
                  enter="transform transition ease-in-out duration-500 sm:duration-300"
                  enter-from="-translate-x-full"
                  enter-to="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-200"
                  leave-from="translate-x-0"
                  leave-to="-translate-x-full">
                  <DialogPanel class="bg-white dark:bg-surface-900 shadow p-6 w-[280px]">
                    <Sidebar :version="menuVersion" />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>

        <ClientOnly>
          <Search />
        </ClientOnly>

        <div class="items-center ml-auto md:flex md:divide-x md:divide-surface-200 md:dark:divide-surface-700">
          <div v-if="shouldShowNavItems" class="items-center hidden gap-12 px-6 md:flex">
            <a
              v-for="{ text, link, target, rel } in navItems"
              :href="link"
              :target="[target ? target : '_self']"
              :rel="[rel ? rel : 'related']"
              class="text-sm font-medium transition-colors duration-500 text-surface-600 dark:text-surface-400 hover:text-primary-500 dark:hover:text-primary-500">
              {{ text }}
            </a>
          </div>

          <div class="flex items-center gap-6 pl-6">
            <VersionPicker v-if="shouldShowVersionPicker" />
            <GitHubLink v-if="shouldShowGitHubLink" class="hidden md:block" />
            <GitlabLink v-if="shouldShowGitlabLink" class="hidden md:block" />
            <TwitterLink v-if="shouldShowTwitterLink" class="hidden md:block" />
            <ThemeSwitcher />
          </div>
        </div>

        <div
          v-if="shouldShowNavItems || shouldShowGitHubLink || shouldShowGitlabLink || shouldShowTwitterLink"
          class="flex items-center gap-3 pl-3">
          <button
            @click="setDotMenuOpen(true)"
            type="button"
            class="flex items-center flex-shrink-0 text-surface-600 md:hidden dark:text-surface-400">
            <span class="sr-only">More</span>
            <i class="icon-[heroicons--ellipsis-vertical] w-6 h-6" />
          </button>

          <Dialog :open="dotMenuOpen" @close="setDotMenuOpen" class="relative z-50">
            <div class="fixed inset-0 bg-white/25 dark:bg-surface-800/30 backdrop-blur" aria-hidden="true" />

            <div class="fixed inset-0 overflow-y-auto">
              <div class="flex justify-end p-6">
                <DialogPanel
                  class="w-auto p-8 space-y-4 bg-white divide-y rounded-lg shadow divide-surface-200 dark:bg-surface-900 dark:divide-surface-600">
                  <div v-if="shouldShowNavItems" class="flex flex-col gap-4 lg:hidden">
                    <HeaderLink v-if="shouldShowNavItems" v-for="item in navItems" :item="item" />
                  </div>

                  <div
                    :class="{
                      'pt-2': shouldShowGitHubLink || shouldShowGitlabLink || shouldShowTwitterLink,
                    }">
                    <div class="flex items-center justify-start space-x-3">
                      <GitHubLink v-if="shouldShowGitHubLink" />
                      <GitlabLink v-if="shouldShowGitlabLink" />
                      <TwitterLink v-if="shouldShowTwitterLink" />
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  </header>
</template>
