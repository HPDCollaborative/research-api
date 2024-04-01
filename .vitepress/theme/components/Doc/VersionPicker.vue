<script setup>
import Dropdown from '@/components/Doc/Dropdown.vue';
import DropdownItem from '@/components/Doc/DropdownItem.vue';

const router = useRouter();
const { page, theme } = useData();
const { currentVersion, updateVersionFromPath } = useVersion();

const allVersions = theme.value.versions;
const defaultPage = theme.value.defaults?.page;

const nextPage = ref('');
const nextVersion = ref('');

// prettier-ignore
watch(() => router.route.path, (newPath) => {
  const path = newPath.split('/');

  if (allVersions.some(version => version.text === path[1])) {
    nextVersion.value = path[1];
    nextPage.value = path[2];
  } else {
    nextVersion.value = null;
    nextPage.value = defaultPage;
  }
}, { immediate: true });

const activeVersion = computed(() => {
  return nextVersion.value !== null ? `v${currentVersion.value}` : null;
});

const switchVersion = (version) => {
  if (activeVersion.value !== null) {
    if (currentVersion.value !== version.text) {
      updateVersionFromPath(version.link);
      router.go(`${version.link}${nextPage.value}`);
    }
  } else {
    updateVersionFromPath(version.link);
    router.go(`${version.link}${nextPage.value}`);
  }
};
</script>

<template>
  <Dropdown align="right" width="20" v-if="allVersions.length > 0">
    <template #trigger>
      <span class="inline-flex rounded-full">
        <button
          type="button"
          class="inline-flex items-center justify-between px-3 py-2 text-sm font-medium leading-4 transition-colors duration-500 rounded-full text-surface-500 bg-surface-100 dark:bg-surface-950 hover:bg-surface-200 hover:text-surface-700 focus:outline-none dark:text-surface-300 dark:hover:bg-surface-800">
          <div
            class="flex items-center justify-between group"
            :class="[activeVersion ? '' : 'text-surface-400 dark:text-surface-600']">
            <span>
              {{ activeVersion || 'select' }}
            </span>
            <i class="icon-[heroicons--chevron-up-down-solid] ml-2 -mb-px h-4 w-4" />
          </div>
        </button>
      </span>
    </template>
    <template #content>
      <div v-if="allVersions.length > 0" class="w-20">
        <template v-for="version in allVersions" :key="version.text">
          <DropdownItem as="button" @click.native="switchVersion(version)">
            <div class="flex items-center cursor-pointer">
              <div>v{{ version.text }}</div>
              <i
                v-if="activeVersion && version.text === currentVersion"
                class="icon-[heroicons--check-badge-solid] flex-shrink-0 w-5 h-5 ml-2 text-primary-500" />
            </div>
          </DropdownItem>
        </template>
      </div>
    </template>
  </Dropdown>
</template>
