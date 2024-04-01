<script setup>
const { theme } = useData();
const version = theme.value.defaults?.version;
const page = theme.value.defaults?.page;

const useBase = (path) => {
  return withBase(path);
};
</script>

<template>
  <main class="grid px-6 py-24 bg-white md:mt-5 dark:bg-surface-800 place-items-center sm:py-12 lg:px-8">
    <div class="text-center">
      <div class="mx-auto max-w-56">
        <img :src="useBase('/logo.svg')" />
      </div>
      <h1 class="mt-4 text-3xl font-medium tracking-tight text-surface-900 dark:text-surface-300 md:text-5xl">
        <span class="mr-3 text-primary-500">404</span> Whoops!!
      </h1>
      <p class="w-full mx-auto mt-6 text-base leading-7 text-left md:max-w-xl text-surface-600 dark:text-surface-300">
        This page of the documentation is probably not included in this version. Use the left menu to select an
        available page, or if you use the version menu above, you can probably find an available version of the page
        you're looking for.
      </p>
      <div class="flex items-center justify-center max-w-xl mt-10 gap-x-6">
        <span class="text-sm font-semibold text-surface-900 dark:text-surface-300"> Or ... </span>
        <a
          :href="useBase(`/${version}/${page}`)"
          class="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold hover:bg-primary-600 !border-none !text-white shadow-sm">
          Start from Scratch
        </a>
      </div>
    </div>
  </main>
</template>
