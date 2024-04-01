<script setup>
import SidebarItem from '@/components/Doc/SidebarItem.vue';
import Logo from '@/components/Doc/Logo.vue';

const { site, theme } = useData();
const { route } = useRouter();

const props = defineProps({
  version: {
    type: String,
    required: true,
  },
});

const menuVersion = computed(() => {
  return props.version || theme.value.defaults?.version;
});

const sidebar = computed(() => {
  return theme.value.sidebar[menuVersion.value];
});

const sidebarItems = computed(() =>
  (Array.isArray(sidebar.value) ? sidebar.value : []).map((item) => ({
    ...item,
    items: item.items ? item.items.map((i) => ({ ...i, link: withBase(i.link) })) : undefined,
    link: item.items ? undefined : withBase(item.link),
  }))
);
</script>

<template>
  <nav class="flex flex-col gap-6">
    <Logo class="lg:hidden flex-shrink-0 w-[248px] mb-2" :alt="site.title" />
    <div v-for="entry in sidebarItems" :key="entry.text">
      <div v-if="entry.items">
        <span class="font-semibold text-surface-800 dark:text-surface-200">
          {{ entry.text }}
        </span>
        <div v-if="entry.items.length" class="mt-2">
          <SidebarItem v-for="subItem in entry.items" :key="subItem.text" :item="subItem" :entry="route.path" />
        </div>
      </div>
      <div v-else>
        <a
          :href="entry.link"
          class="block text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white">
          {{ entry.text }}
        </a>
      </div>
    </div>
  </nav>
</template>
