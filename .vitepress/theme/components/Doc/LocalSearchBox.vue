<script setup>
import Fuse from 'fuse.js';
import searchIndex from '../../data/search.json';

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(['close']);
const router = useRouter();
const minLength = ref(2);
const client = ref(null);

const onEscapeKeyDown = (event) => {
  if (event.key === 'Escape') {
    handleClose();
  }
};

const rawQuery = ref('');
const query = computed(() => rawQuery.value.toLowerCase().trim());

onMounted(() => {
  client.value = new Fuse(searchIndex, {
    keys: [
      {
        name: 'title',
        weight: 1,
      },
      {
        name: 'content',
        weight: 2,
      },
    ],
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: minLength.value,
  });

  window.addEventListener('keydown', onEscapeKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', onEscapeKeyDown);
});

const filteredResults = computed(() => {
  if (query.value.length > 0) {
    const response = client.value.search(query.value);

    if (response && response.length > 0) {
      const results = response.map((result) => result.item);

      // Group by version and category
      const grouped = results.reduce((acc, item) => {
        const versionKey = item.version || 'unknown';
        const categoryKey = item.category || 'Uncategorized';

        if (!acc[versionKey]) acc[versionKey] = {};
        if (!acc[versionKey][categoryKey]) acc[versionKey][categoryKey] = [];

        acc[versionKey][categoryKey].push(item);
        return acc;
      }, {});

      return Object.entries(grouped)
        .sort(([versionA], [versionB]) => versionB.localeCompare(versionA))
        .map(([version, categories]) => {
          return {
            version,
            categories: Object.entries(categories)
              .sort(([catA], [catB]) => catA.localeCompare(catB))
              .map(([category, items]) => {
                return {
                  category,
                  items: items.sort((a, b) => a.id - b.id),
                };
              }),
          };
        });
    }
  }

  return [];
});

const truncateString = (str) => {
  if (str.length <= 59) {
    return str;
  }
  return str.slice(0, 58) + ' ...';
};

const handleClose = () => {
  open.value = false;
  emit('close');
};

const onSelect = (item) => {
  handleClose();

  rawQuery.value = '';

  router.go(item.url);
};
</script>
<template>
  <TransitionRoot :show="open" as="template" @after-leave="rawQuery = ''" appear>
    <Dialog as="div" class="relative z-30" @close="handleClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0">
        <div class="fixed inset-0 z-30 transition-opacity bg-surface-400/50 dark:bg-surface-600/50 backdrop-blur" />
      </TransitionChild>

      <div class="fixed inset-0 z-40 w-screen p-4 overflow-y-auto sm:p-6 md:p-20">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95">
          <DialogPanel
            class="max-w-xl mx-auto overflow-hidden transition-all transform bg-white divide-y rounded-md shadow-2xl divide-surface-100 dark:bg-surface-950 dark:divide-surface-600 ring-1 ring-black ring-opacity-5">
            <Combobox @update:modelValue="onSelect">
              <div class="relative">
                <i
                  class="icon-[heroicons--magnifying-glass] pointer-events-none absolute left-4 top-3 h-6 w-6 text-surface-600 dark:text-surface-400"
                  aria-hidden="true" />
                <ComboboxInput
                  class="w-full h-12 pr-4 bg-transparent border-0 pl-[3.25rem] text-surface-900 dark:text-surface-400 placeholder:text-surface-600 dark:placeholder:text-surface-400 focus:ring-0 sm:text-xl"
                  placeholder="Search ..."
                  @change="rawQuery = $event.target.value" />
              </div>

              <ComboboxOptions
                v-if="filteredResults.length > 0"
                static
                class="p-4 pb-2 space-y-4 overflow-y-auto max-h-80 transform-gpu scroll-py-10 scroll-pb-2">
                <template v-for="(group, index) in filteredResults" :key="index">
                  <li v-for="(categoryGroup, catIndex) in group.categories" :key="catIndex">
                    <h2 class="text-sm font-semibold text-primary-600">
                      {{ categoryGroup.category }}
                    </h2>
                    <ul class="mt-2 -mx-4 text-sm text-surface-700">
                      <ComboboxOption
                        v-for="(item, itemIndex) in categoryGroup.items"
                        :key="itemIndex"
                        :value="item"
                        as="template"
                        v-slot="{ active }">
                        <li
                          :class="[
                            'flex cursor-default select-none items-start px-4 py-2',
                            active && 'bg-primary-600 cursor-pointer text-white',
                          ]">
                          <!-- Left Column -->
                          <i
                            :class="[
                              'icon-[heroicons--document-text] h-8 w-8 flex-none mt-[4px]',
                              active ? 'text-white' : 'text-surface-800 dark:text-surface-300',
                            ]"
                            aria-hidden="true" />

                          <!-- Center Column -->
                          <div class="flex-auto ml-3">
                            <div
                              class="mb-[2px] text-base font-normal truncate"
                              :class="[active ? 'text-white' : 'text-surface-800 dark:text-surface-300']">
                              <h3 class="text-lg font-semibold">
                                {{ item.header }}
                              </h3>
                              {{ truncateString(item.content) }}
                            </div>
                            <div
                              class="flex items-center justify-between max-w-[450px] text-xs font-semibold truncate"
                              :class="[active ? 'text-white' : 'text-surface-400 dark:text-surface-500']">
                              <span>{{ item.title }}</span>
                              <span>v{{ item.version }}</span>
                            </div>
                          </div>
                          <div class="flex items-center justify-end flex-shrink-0">
                            <svg :class="[active ? 'block' : 'hidden']" width="20" height="20" viewBox="0 0 20 20">
                              <g
                                stroke="currentColor"
                                fill="none"
                                fill-rule="evenodd"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2">
                                <path d="M18 3v4c0 2-2 4-4 4H2"></path>
                                <path d="M8 17l-6-6 6-6"></path>
                              </g>
                            </svg>
                          </div>
                        </li>
                      </ComboboxOption>
                    </ul>
                  </li>
                </template>
              </ComboboxOptions>

              <div v-if="rawQuery === '?'" class="px-6 text-sm text-center py-14 sm:px-14">
                <i
                  class="icon-[heroicons--lifebuoy] w-10 h-10 mx-auto text-surface-600 dark:text-surface-400"
                  aria-hidden="true" />
                <p class="mt-2 text-surface-600 dark:text-surface-400">
                  Use this tool to quickly search for<br />
                  documentation across our entire platform.
                </p>
              </div>

              <div
                v-if="query !== '' && query.length > minLength && rawQuery !== '?' && filteredResults.length === 0"
                class="px-6 text-sm text-center py-14 sm:px-14">
                <i
                  class="icon-[heroicons--exclamation-triangle] w-10 h-10 mx-auto text-surface-600 dark:text-surface-400"
                  aria-hidden="true" />
                <p class="mt-4 font-semibold text-surface-600 dark:text-surface-400">No results found</p>
                <p class="mt-2 text-surface-500">We couldn’t find anything with that term. Please try again.</p>
              </div>

              <div
                class="flex w-full items-center text-gray-500/80 bg-surface-50 dark:bg-surface-800 dark:text-surface-400 px-4 py-2.5 text-xs">
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center justify-start">
                    <kbd
                      class="kbd flex items-center text-gray-500/60 dark:text-surface-400 justify-center mr-1 p-[3px] rounded-[3px]">
                      <svg width="15" height="15" viewBox="0 0 24 24" aria-label="Enter key">
                        <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                          <path
                            d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"></path>
                          <path
                            d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"></path>
                        </g>
                      </svg>
                    </kbd>
                    to select
                    <kbd
                      class="kbd flex ml-2 items-center text-gray-500/60 dark:text-surface-400 justify-center mr-1 p-[3px] rounded-[3px]">
                      <svg width="15" height="15" viewBox="0 0 24 24" aria-label="Arrow down">
                        <path
                          fill="currentColor"
                          d="M12 4a1 1 0 0 1 1 1v11.586l4.293-4.293a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L11 16.586V5a1 1 0 0 1 1-1z"></path>
                      </svg>
                    </kbd>
                    <kbd
                      class="kbd flex items-center text-gray-500/60 dark:text-surface-400 justify-center mr-1 p-[3px] rounded-[3px]">
                      <svg width="15" height="15" viewBox="0 0 24 24" aria-label="Arrow up">
                        <path
                          fill="currentColor"
                          d="M12 4a1 1 0 0 1 .707.293l6 6a1 1 0 0 1-1.414 1.414L13 7.414V19a1 1 0 1 1-2 0V7.414l-4.293 4.293a1 1 0 0 1-1.414-1.414l6-6A1 1 0 0 1 12 4z"></path>
                      </svg>
                    </kbd>
                    to navigate
                    <kbd
                      class="kbd flex items-center text-gray-500/60 dark:text-surface-400 justify-center ml-2 mr-1 p-[3px] rounded-[3px]">
                      <svg width="16" height="16" viewBox="0 0 16 16" role="img" aria-label="Escape key">
                        <g
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.2">
                          <path
                            d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"></path>
                        </g>
                      </svg>
                    </kbd>
                    to close
                  </div>
                  <div class="flex items-center justify-end">
                    powered by
                    <svg
                      xml:space="preserve"
                      fill-rule="evenodd"
                      stroke-linejoin="round"
                      stroke-miterlimit="2"
                      clip-rule="evenodd"
                      viewBox="0 0 1870 582"
                      class="w-auto h-5 ml-2 text-gray-500/80 dark:text-surface-400">
                      <g fill-rule="nonzero">
                        <path
                          fill="#9B59B6"
                          class="dark:opacity-50"
                          d="M222 4c23-5 65-5 89 0 19 8 23 25 21 44-6 54-14 108-19 162 44-34 85-71 130-104 16-13 38-12 50 6 16 21 30 46 39 71 4 20-9 34-27 41l-150 62 150 59c19 8 32 24 25 45-10 24-24 50-40 71-13 14-33 13-48 2l-129-97c6 55 15 108 19 163 2 17-9 34-27 37-27 3-56 4-83-2-19-7-23-25-21-44 5-51 13-102 18-154l-115 87c-14 10-28 23-47 17-14-3-23-22-30-33-10-18-24-38-27-58 2-24 20-31 39-39l139-53-140-58c-13-6-30-12-36-27-7-16 4-32 10-46 10-18 20-38 35-52 17-12 32-6 47 5 43 33 84 68 126 101L201 48c-2-19 1-37 21-44Z" />
                        <path
                          fill="currentColor"
                          d="M744 467c-6 0-10-1-15-4-4-2-6-6-6-11V117c0-5 2-9 6-12 4-2 8-3 13-3h176c5 0 9 2 11 5a32 32 0 0 1 0 27c-3 4-6 6-11 6H765v127h78c5 0 8 1 11 5 2 4 3 8 3 13l-3 11c-2 4-6 5-11 5h-78v151c0 5-3 9-7 11-4 3-9 4-14 4Zm253 4a103 103 0 0 1-86-49c-8-15-13-30-13-47V245c0-4 2-7 6-10 5-3 9-5 15-5s10 2 15 5c4 3 6 6 6 10v130c0 10 2 19 7 28s12 16 21 22 18 8 29 8 20-2 29-8a62 62 0 0 0 28-50V245c0-4 2-8 7-10 4-3 9-5 14-5 6 0 11 2 15 5 4 2 6 6 6 10v130a103 103 0 0 1-50 83c-15 8-31 13-49 13Zm213 0c-16 0-30-2-42-6-13-4-22-9-29-15s-11-11-11-17l2-8 5-8c2-2 5-3 7-3 4 0 9 2 13 6l19 12c9 3 20 5 35 5 18 0 30-3 37-9 7-7 10-14 10-22 0-10-3-18-9-24-5-5-13-10-22-13l-30-9-30-11c-9-5-16-11-22-19s-9-19-9-33c0-11 3-22 8-32 5-11 14-20 26-27s28-11 48-11a127 127 0 0 1 60 14c7 4 10 8 10 13 0 2 0 5-2 8l-5 9c-3 3-5 4-9 4-3 0-7-1-11-4l-18-7a78 78 0 0 0-51 2c-7 4-12 9-15 14s-4 10-4 15c0 9 3 15 9 20s13 8 23 11l29 9c11 3 21 7 30 12s17 12 23 21 9 21 9 36c0 20-8 37-22 49a95 95 0 0 1-62 18Zm221 0c-22 0-41-4-58-12a90 90 0 0 1-54-85l1-52c0-17 4-33 13-47a101 101 0 0 1 134-36c14 8 26 19 35 33 9 13 13 29 13 47 0 13-2 23-6 29-5 6-10 9-17 10-7 2-14 2-21 2h-110v16c0 18 7 33 20 44s31 16 51 16a73 73 0 0 0 48-15c4-3 9-5 13-5 3 0 6 2 9 4a23 23 0 0 1 7 15c0 5-3 10-9 15-6 6-16 11-27 15-12 4-26 6-42 6Zm-70-139h92c9 0 15-1 18-3s5-6 5-12c0-10-3-20-8-28a56 56 0 0 0-50-29 58 58 0 0 0-49 27c-5 8-8 17-8 28v17Zm205 138a26 26 0 0 1-26-26 26 26 0 0 1 26-26c7 0 13 2 18 7s7 12 7 19-2 13-7 18-11 8-18 8Zm39 112c-8 0-14-2-17-6s-5-8-5-12c0-6 2-11 5-14 4-3 8-5 12-5 10 0 16-2 21-7s7-12 9-21l2-30V245c0-5 2-8 5-11 4-2 9-4 15-4s11 2 15 4c4 3 6 6 6 11v242c0 18-2 35-7 49s-12 26-22 34-23 12-39 12Zm47-417c-7 0-13-2-18-7s-8-11-8-17 3-12 8-17c5-4 11-6 18-6s13 2 18 6c5 5 8 11 8 17s-3 12-8 17-11 7-18 7Zm134 306c-16 0-30-2-42-6-13-4-22-9-29-15s-11-11-11-17l2-8 5-8c2-2 5-3 7-3 4 0 9 2 13 6l19 12c9 3 20 5 35 5 18 0 30-3 37-9 7-7 10-14 10-22 0-10-3-18-9-24-5-5-13-10-22-13l-30-9-30-11c-9-5-16-11-22-19s-9-19-9-33c0-11 3-22 8-32 5-11 14-20 26-27s28-11 48-11a127 127 0 0 1 60 14c7 4 10 8 10 13 0 2 0 5-2 8l-5 9c-3 3-5 4-9 4-3 0-7-1-11-4l-18-7a78 78 0 0 0-51 2c-7 4-12 9-15 14s-4 10-4 15c0 9 3 15 9 20s13 8 23 11l29 9c11 3 21 7 30 12s17 12 23 21 9 21 9 36c0 20-8 37-22 49a95 95 0 0 1-62 18Z" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
