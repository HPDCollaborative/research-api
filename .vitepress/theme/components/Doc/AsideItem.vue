<script setup>
defineProps({
  headers: Array,
});

function onClick(event) {
  const el = event.target;
  const id = '#' + el.href.split('#')[1];
  const heading = document.querySelector(decodeURIComponent(id));
  if (heading) heading.focus();
}

const truncate = (str, length = 25) => {
  if (str.length <= length) {
    return str;
  }
  return str.substring(0, length) + ' ...';
};
</script>

<template>
  <li
    v-for="{ children, link, title } in headers"
    class="text-sm text-surface-700 dark:text-surface-500 -ml-[2px] my-2">
    <a
      @click="onClick"
      class="block py-0 pl-3 my-0 duration-500 ease-linear border-l-2 transition-color dark:border-surface-700 dark:hover:border-surface-400 hover:border-primary-500 hover:text-surface-900 border-surface-300/50 outline-link dark:hover:text-surface-400"
      :href="link">
      {{ truncate(title) }}
    </a>

    <template v-if="children?.length">
      <li v-for="subItem in children" class="my-2 leading-normal">
        <a
          class="flex items-center py-0 pl-2 duration-500 ease-linear border-l-2 transition-color group dark:border-surface-700 dark:hover:border-surface-500 hover:border-primary-500 border-surface-300/50 outline-link text-surface-700 dark:text-surface-500"
          :href="subItem.link">
          <i
            class="icon-[heroicons--minus-20-solid] flex-shrink-0 mr-2 group-hover:text-surface-900 dark:group-hover:text-surface-400" />

          <span class="group-hover:text-surface-900 dark:group-hover:text-surface-400">{{
            truncate(subItem.title)
          }}</span>
        </a>
      </li>
    </template>
  </li>
</template>
