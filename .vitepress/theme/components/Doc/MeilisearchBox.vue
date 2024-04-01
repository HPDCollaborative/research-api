<script setup>
import { MeiliSearch } from 'meilisearch';

const props = defineProps({
  open: Boolean,
});

const host = ref('');
const apiKey = ref('');
const indexName = ref('');

const { theme } = useData();

const emit = defineEmits(['close']);
const router = useRouter();

const onEscapeKeyDown = (event) => {
  if (event.key === 'Escape') {
    handleClose();
  }
};

const rawQuery = ref('');
const query = computed(() => rawQuery.value.toLowerCase().trim());
const client = ref(null);
const filteredResults = ref([]);

host.value = theme.value.search.options?.host;
apiKey.value = theme.value.search.options?.apiKey;
indexName.value = theme.value.search.options?.indexName;

onMounted(() => {
  client.value = new MeiliSearch({
    host: host.value,
    apiKey: apiKey.value,
  });

  window.addEventListener('keydown', onEscapeKeyDown);
});

onUnmounted(() => {
  client.value = null;
  window.removeEventListener('keydown', onEscapeKeyDown);
});

watchEffect(async () => {
  if (query.value.length > 0) {
    const response = await client.value.index(indexName.value).search(query.value);

    if (response.hits && response.hits.length > 0) {
      const results = response.hits.map((hit) => hit);

      const grouped = results.reduce((acc, item) => {
        const versionKey = item.version || 'unknown';
        const categoryKey = item.category || 'Uncategorized';

        if (!acc[versionKey]) acc[versionKey] = {};
        if (!acc[versionKey][categoryKey]) acc[versionKey][categoryKey] = [];

        acc[versionKey][categoryKey].push(item);
        return acc;
      }, {});

      filteredResults.value = Object.entries(grouped)
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
});

const truncateString = (str) => {
  if (str.length <= 59) {
    return str;
  }
  return str.slice(0, 58) + ' ...';
};

const handleClose = () => {
  open.value = false;
  rawQuery.value = '';
  filteredResults.value = [];
  emit('close');
};

const onSelect = (item) => {
  handleClose();
  rawQuery.value = '';
  filteredResults.value = [];
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
                v-if="
                  query !== '' &&
                  //query.length > minLength &&
                  rawQuery !== '?' &&
                  filteredResults.length === 0
                "
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
                      width="110"
                      height="30"
                      viewBox="0 0 495 74"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-auto h-8 mb-[2px] ml-2 text-surface-800 dark:text-surface-400">
                      <path
                        fill="currentColor"
                        d="M181.84 42.5347C181.84 37.6136 184.199 34.7149 188.716 34.7149C192.963 34.7149 194.378 37.7484 194.378 41.6584V62.6237H203.951V40.5798C203.951 32.3554 199.637 26.4906 191.143 26.4906C186.087 26.4906 182.514 28.041 179.413 31.4791C177.39 28.3781 173.952 26.4906 169.166 26.4906C164.11 26.4906 160.605 28.5804 158.987 31.6139V27.2995H150.156V62.6237H159.728V42.3325C159.728 37.6136 162.155 34.7149 166.604 34.7149C170.851 34.7149 172.267 37.7484 172.267 41.6584V62.6237H181.84V42.5347Z"></path>
                      <path
                        fill="currentColor"
                        d="M243.242 47.7255C243.242 47.7255 243.377 46.4447 243.377 44.8942C243.377 34.4452 236.299 26.4906 225.85 26.4906C215.401 26.4906 208.12 34.4452 208.12 44.8942C208.12 55.7476 215.468 63.4326 225.917 63.4326C234.074 63.4326 240.546 58.5115 242.636 51.3658H232.996C231.85 53.9274 229.086 55.2083 226.187 55.2083C221.401 55.2083 218.3 52.5792 217.626 47.7255H243.242ZM225.783 34.1756C230.232 34.1756 233.131 36.8721 233.805 40.8494H217.76C218.569 36.8047 221.401 34.1756 225.783 34.1756Z"></path>
                      <path
                        fill="currentColor"
                        d="M244.789 35.5238H249.036V62.6237H258.608V27.2995H244.789V35.5238ZM253.822 22.7155C257.193 22.7155 259.619 20.356 259.619 16.9854C259.619 13.6148 257.193 11.1879 253.822 11.1879C250.451 11.1879 248.024 13.6148 248.024 16.9854C248.024 20.356 250.451 22.7155 253.822 22.7155Z"></path>
                      <path
                        fill="currentColor"
                        d="M278.43 54.3993C278.16 54.3993 277.756 54.4667 277.149 54.4667C274.992 54.4667 274.722 53.4556 274.722 51.9725V12.0643H265.15V52.6466C265.15 59.6575 267.846 62.7585 275.464 62.7585C276.745 62.7585 277.958 62.6237 278.43 62.5562V54.3993Z"></path>
                      <path
                        fill="currentColor"
                        d="M279.519 35.5238H283.766V62.6237H293.339V27.2995H279.519V35.5238ZM288.553 22.7155C291.923 22.7155 294.35 20.356 294.35 16.9854C294.35 13.6148 291.923 11.1879 288.553 11.1879C285.182 11.1879 282.755 13.6148 282.755 16.9854C282.755 20.356 285.182 22.7155 288.553 22.7155Z"></path>
                      <path
                        fill="currentColor"
                        d="M312.557 62.9939C321.86 62.9939 326.242 58.0728 326.242 52.882C326.242 38.4557 305.007 46.4778 305.007 36.9726C305.007 33.8717 307.636 31.2426 312.962 31.2426C318.422 31.2426 320.984 34.2087 321.388 37.9164H326.175C325.77 33.265 322.602 27.063 313.097 27.063C304.94 27.063 300.356 31.9167 300.356 37.1749C300.356 51.2641 321.591 43.1746 321.591 53.0168C321.591 56.4548 318.355 58.8143 312.557 58.8143C306.625 58.8143 303.659 55.8481 303.322 51.4663H298.468C298.872 57.466 302.648 62.9939 312.557 62.9939Z"></path>
                      <path
                        fill="currentColor"
                        d="M364.256 46.4104C364.256 46.4104 364.324 45.3318 364.324 44.5903C364.324 34.8829 358.054 27.063 347.808 27.063C337.494 27.063 330.955 35.4896 330.955 44.9947C330.955 54.6347 337.022 62.9939 347.875 62.9939C356.032 62.9939 361.695 58.0053 363.717 51.4663H358.728C357.245 55.6459 353.201 58.6795 347.942 58.6795C340.729 58.6795 336.213 53.3539 335.741 46.4104H364.256ZM347.808 31.3774C354.549 31.3774 358.931 35.894 359.537 42.5005H335.876C336.685 36.1637 341.134 31.3774 347.808 31.3774Z"></path>
                      <path
                        fill="currentColor"
                        d="M394.037 45.8711V49.1069C394.037 54.9718 389.79 59.0165 381.633 59.0165C376.578 59.0165 373.814 56.9267 373.814 52.4101C373.814 50.1181 374.892 48.3654 376.578 47.4216C378.33 46.4778 380.69 45.8711 394.037 45.8711ZM381.094 62.9939C387.026 62.9939 391.813 61.1063 394.24 57.1964V62.1849H398.824V39.7366C398.824 32.1189 394.442 27.063 384.532 27.063C375.027 27.063 370.847 31.8493 369.971 37.9838H374.623C375.566 33.1301 379.274 31.1752 384.33 31.1752C390.802 31.1752 394.037 33.8717 394.037 39.6691V41.8938C383.184 41.8938 378.667 42.096 375.297 43.4442C371.387 44.9947 369.095 48.4328 369.095 52.5449C369.095 58.5446 372.937 62.9939 381.094 62.9939Z"></path>
                      <path
                        fill="currentColor"
                        d="M424.991 27.6023C424.991 27.6023 424.182 27.5349 423.845 27.5349C417.508 27.5349 414.138 30.8381 412.857 33.1975V27.872H408.273V62.1849H413.059V42.7027C413.059 35.557 417.441 32.0515 423.306 32.0515C424.182 32.0515 424.991 32.1189 424.991 32.1189V27.6023Z"></path>
                      <path
                        fill="currentColor"
                        d="M425.809 45.0621C425.809 54.4325 432.28 62.9939 442.729 62.9939C452.032 62.9939 457.425 56.7919 458.773 49.9832H453.92C452.504 55.3088 448.594 58.6795 442.729 58.6795C435.516 58.6795 430.662 52.9494 430.662 45.0621C430.662 37.1075 435.516 31.3774 442.729 31.3774C448.594 31.3774 452.504 34.748 453.92 40.0736H458.773C457.425 33.265 452.032 27.063 442.729 27.063C432.28 27.063 425.809 35.6244 425.809 45.0621Z"></path>
                      <path
                        fill="currentColor"
                        d="M470.041 11.6255H465.255V62.1849H470.041V41.8938C470.041 34.8829 474.558 31.2426 480.355 31.2426C486.49 31.2426 489.389 35.0177 489.389 41.2196V62.1849H494.175V40.2759C494.175 32.6582 489.658 27.063 481.164 27.063C474.76 27.063 471.255 30.5685 470.041 32.6582V11.6255Z"></path>
                      <path
                        fill="url(#paint1)"
                        class="dark:opacity-50"
                        d="M0.824951 73.993L24.0688 14.5224C27.3443 6.14179 35.4223 0.625977 44.4202 0.625977H58.4336L35.1898 60.0966C31.9143 68.4772 23.8363 73.993 14.8383 73.993H0.824951Z"></path>
                      <path
                        fill="url(#paint1)"
                        class="dark:opacity-50"
                        d="M34.9246 73.9932L58.1684 14.5226C61.4439 6.14197 69.5219 0.626152 78.5199 0.626152H92.5332L69.2894 60.0968C66.0139 68.4774 57.9359 73.9932 48.9379 73.9932H34.9246Z"></path>
                      <path
                        fill="url(#paint1)"
                        class="dark:opacity-50"
                        d="M69.0262 73.9932L92.27 14.5226C95.5455 6.14197 103.623 0.626152 112.621 0.626152H126.635L103.391 60.0968C100.115 68.4774 92.0375 73.9932 83.0395 73.9932H69.0262Z"></path>
                      <defs>
                        <linearGradient
                          id="paint1"
                          x1="41.1499"
                          y1="-1.33294"
                          x2="-1.49296e-06"
                          y2="21.9145"
                          gradientUnits="userSpaceOnUse">
                          <stop stop-color="#FF5CAA" />
                          <stop offset="1" stop-color="#FF4E62" />
                        </linearGradient>
                      </defs>
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
