<script setup>
import { withBase } from 'vitepress';
import PrevNextLink from '@/components/Doc/PrevNextLink.vue';

const { theme } = useData();

const editLink = useEditLink();
const control = usePrevNext();

const hasEditLink = computed(() => {
  return theme.value.editLink && theme.value.editLink !== false;
});

const useBase = (path) => {
  return withBase(path);
};
</script>

<template>
  <div class="my-4 border-t border-surface-200 dark:border-surface-700">
    <!-- Prev/Next Links -->
    <div v-if="control.prev?.link || control.next?.link" class="flex items-center w-full px-[10px] pt-4">
      <PrevNextLink
        v-if="control.prev?.link"
        :href="useBase(control.prev?.link ?? '')"
        class="justify-start w-1/2 py-6">
        <template #preLabel>
          <div class="flex items-start transition-transform ease-linear group-hover:translate-x-4">
            <div>
              <div class="mb-1 pl-[26px] text-xs font-[650] uppercase text-primary-500">Previous</div>
              <div
                class="flex items-center justify-start transition-colors ease-in-out group-hover:text-primary-500 text-surface-700 dark:text-surface-400">
                <i
                  class="icon-[heroicons--chevron-right-solid] invisible [transition:visibility] ease-in-out group-hover:visible mr-2 rotate-180 shrink-0 text-primary-500" />
                <span>{{ control.prev.text }}</span>
              </div>
            </div>
          </div>
        </template>
      </PrevNextLink>

      <PrevNextLink
        v-if="control.next?.link"
        :href="useBase(control.next?.link ?? '')"
        class="justify-end py-6 group"
        :class="[control.prev?.link ? 'w-1/2' : 'w-full']">
        <template #postLabel>
          <div class="flex-row items-end transition-transform ease-linear group-hover:-translate-x-4">
            <div>
              <div class="mb-1 pr-[26px] text-right text-xs font-[650] uppercase text-primary-500">Next</div>
              <div
                class="flex items-center justify-end transition-colors ease-in-out group-hover:text-primary-500 text-surface-700 dark:text-surface-400">
                <span>{{ control.next.text }}</span>
                <i
                  class="icon-[heroicons--chevron-right-solid] invisible [transition:visibility] ease-in-out group-hover:visible ml-2 shrink-0 text-primary-500" />
              </div>
            </div>
          </div>
        </template>
      </PrevNextLink>
    </div>

    <!-- Edit on GitHub Link -->
    <p class="pt-6 text-center" v-if="hasEditLink">
      <a
        :href="editLink.url"
        class="text-xs text-surface-500 hover:text-surface-700 dark:text-surface-500 dark:hover:text-surface-300">
        {{ editLink.text }}
      </a>
    </p>
  </div>
</template>
