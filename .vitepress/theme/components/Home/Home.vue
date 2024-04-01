<script setup>
import Header from '@/components/Home/Header.vue';
import Card from '@/components/Home/Card.vue';

const { theme } = useData();
const isDark = useDark();

const version = theme.value.defaults?.version;
const page = theme.value.defaults?.page;
const gitlab = theme.value.gitlabUrl;
const company = theme.value.copyright;

const date = new Date();
const year = date.getFullYear();
</script>

<template>
  <main class="relative w-full">
    <Header />
    <div class="grid grid-cols-1 mt-10 lg:grid-cols-2 lg:mt-20">
      <div>
        <img
          class="w-[467px] md:w-[480px] lg:w-full drop-shadow-[0_20px_20px_lch(var(--color-black)/.80)] dark:drop-shadow-[0_20px_20px_lch(var(--color-amber-500)/.50)]"
          src="/logo.svg"
          :alt="company" />
        <h1 class="mt-10 text-4xl font-medium tracking-tight text-surface-800 dark:text-surface-200 sm:text-6xl">
          Start Shipping Gorgeous Docs
        </h1>
        <p class="mt-6 text-lg leading-8 text-surface-700 dark:text-surface-400">
          Finally developers with Tailwind design systems in their applications can write their docs using Vitepress,
          without having to spend hours building their own theme to match their application.
        </p>
        <div class="flex items-center pb-8 mt-12 gap-x-6">
          <a
            :href="`/${version}/${page}`"
            class="px-5 py-3 text-lg transition-all border rounded-full shadow group border-primary-500/80 duration-400 bg-gradient-to-br from-warning-800 to-primary-300 hover:to-primary-500 hover:shadow-md shadow-black/60 hover:shadow-black/60">
            <span
              class="inline-block font-medium text-transparent uppercase bg-gradient-to-br from-surface-700 to-surface-950 bg-clip-text">
              Get Started
            </span>
          </a>
          <a
            :href="gitlab"
            target="_blank"
            rel="noopener nofollow"
            class="text-2xl font-medium leading-6 transition-colors duration-500 text-surface-800 hover:text-warning-800 dark:text-surface-400 dark:hover:text-primary-500">
            Git Repo <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div>
        <div class="flex items-start justify-center h-full mt-16 lg:mt-10 lg:justify-end lg:pr-16">
          <div
            class="absolute rounded-full h-[370px] w-[370px] blur-3xl bg-[linear-gradient(-45deg,lch(var(--color-info-500))_50%,lch(var(--color-secondary-500))_50%_)]"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xml:space="preserve"
            fill-rule="evenodd"
            class="z-30 w-[250px] mr-12 mt-9 h-auto -rotate-[12deg] drop-shadow-[0_20px_20px_lch(var(--color-black)/.60)]"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            clip-rule="evenodd"
            viewBox="0 0 2334 3000">
            <path
              fill="url(#a)"
              d="M2333.3 116.7v2766.6c0 64.4-52.2 116.7-116.6 116.7h-2100A116.7 116.7 0 0 1 0 2883.3V116.7C0 52.3 52.3 0 116.7 0h2100c64.4 0 116.6 52.3 116.6 116.7Z" />
            <path
              class="fill-white dark:fill-black/80"
              d="M2208.3 208.3v2583.4c0 46-37.3 83.3-83.3 83.3H208.3c-46 0-83.3-37.3-83.3-83.3V208.3c0-46 37.3-83.3 83.3-83.3H2125c46 0 83.3 37.3 83.3 83.3Z" />
            <path
              fill="url(#b)"
              d="M1111.2 1540.9H933.5v-44.3h177.7l-.1-177.7h44.2l.1 177.7h177.8v44.3h-177.7l.1 177.7h-44.2l-.2-177.7Z" />
            <g fill-rule="nonzero">
              <path
                fill="url(#c)"
                d="m1409 396.2-542.7 970.6a29.5 29.5 0 0 1-51.4.2L261.3 396.3a29.5 29.5 0 0 1 30.8-43.7l543.4 97.1c3.5.7 7 .6 10.5 0l532-97a29.5 29.5 0 0 1 31 43.5Z" />
              <path
                fill="url(#d)"
                d="M1094.4 225.2 692.7 304a14.8 14.8 0 0 0-12 13.6L656.2 735a14.8 14.8 0 0 0 18 15.2L786 724.3a14.7 14.7 0 0 1 17.7 17.3l-33.2 162.7c-2.2 11 8 20.3 18.7 17l69.1-20.9c10.7-3.2 21 6.1 18.8 17.1l-52.9 255.6c-3.3 16 18 24.7 26.9 11l5.9-9.2 327.3-653.2c5.5-11-4-23.4-16-21.1l-115 22.2a14.7 14.7 0 0 1-17-18.6l75-260.4c3.1-10.6-6-20.7-17-18.6Z" />
            </g>
            <path
              class="fill-info-400"
              d="M1360.7 1874.3c-188.8 0-306.8 94.4-354 283.2 70.8-94.4 153.4-129.8 247.8-106.2 53.8 13.5 92.3 52.6 135 95.8 69.4 70.5 149.7 152 325.2 152 188.8 0 306.8-94.4 354-283.2-70.8 94.4-153.4 129.8-247.8 106.2-53.8-13.4-92.3-52.5-135-95.8-69.4-70.4-149.7-152-325.2-152Zm-354 424.8c-188.9 0-306.9 94.4-354 283.3 70.7-94.5 153.3-129.9 247.8-106.3 53.8 13.5 92.3 52.6 135 95.8 69.3 70.5 149.7 152 325.2 152 188.8 0 306.8-94.3 354-283.2-70.8 94.5-153.4 129.9-247.8 106.3-53.9-13.5-92.4-52.6-135-95.8-69.4-70.5-149.7-152-325.2-152Z" />
            <defs>
              <linearGradient
                id="a"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
                gradientTransform="matrix(2158.3 2833.3 -3642.9 2775 87.5 83.3)"
                gradientUnits="userSpaceOnUse">
                <stop offset="0" style="stop-color: lch(var(--color-secondary-800))" />
                <stop offset=".4" style="stop-color: lch(var(--color-secondary-600))" />
                <stop offset="1" style="stop-color: lch(var(--color-info-500))" />
              </linearGradient>
              <linearGradient
                id="b"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
                gradientTransform="matrix(399.7 399.7 -399.8 399.7 933.5 1318.9)"
                gradientUnits="userSpaceOnUse">
                <stop offset="0" style="stop-color: lch(var(--color-info-400))" />
                <stop offset="1" style="stop-color: lch(var(--color-secondary-600))" />
              </linearGradient>
              <linearGradient
                id="c"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
                gradientTransform="rotate(54 -190.5 404) scale(1139.4)"
                gradientUnits="userSpaceOnUse">
                <stop offset="0" style="stop-color: lch(var(--color-info-400))" />
                <stop offset="1" style="stop-color: lch(var(--color-secondary-500))" />
              </linearGradient>
              <linearGradient
                id="d"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
                gradientTransform="matrix(118 839 -839 118 806 249.4)"
                gradientUnits="userSpaceOnUse">
                <stop offset="0" style="stop-color: lch(var(--color-warning-200))" />
                <stop offset=".1" style="stop-color: lch(var(--color-warning-300))" />
                <stop offset="1" style="stop-color: lch(var(--color-warning-400))" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
    <div
      class="grid grid-cols-1 gap-4 pt-8 mt-32 mb-12 border-t lg:mt-0 md:grid-cols-2 lg:grid-cols-3 border-surface-300/50 dark:border-surface-700/50">
      <Card color="secondary">
        <template #heading>
          <svg version="1.1" viewBox="0 0 261.76 226.69" class="w-auto h-6 mr-3" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)">
              <g transform="translate(178.06 235.01)">
                <path
                  class="fill-secondary-950/50"
                  d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" />
              </g>
              <g transform="translate(178.06 235.01)">
                <path
                  class="fill-secondary-950"
                  d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" />
              </g>
            </g>
          </svg>
          <h3 class="text-2xl font-medium">Component Control</h3>
        </template>
        <template #content>
          <div class="space-y-3">
            <p class="px-2">
              As developers it's just a fact ... we want to change everything. And sometimes that's just not feasible.
              With the default Vitepress theme, or any packaged theme, it's nearly impossible.
            </p>
            <p class="p-4 rounded-md bg-secondary-950/50 text-secondary-300/80">
              Since Doczilla is a starter kit and not an npm packaged theme, all of your theme assets come installed
              right in your ".vitepress" directory. Components, composables, css, all available to customize as you
              wish.
            </p>
            <p class="text-lg font-semibold text-center">Make your docs theme your own!</p>
          </div>
        </template>
      </Card>
      <Card color="primary">
        <template #heading>
          <img class="w-auto h-8 mr-3" src="/zilla.svg" alt="" />
          <h3 class="text-2xl font-medium text-warning-950">Tools & Features</h3>
        </template>
        <template #content>
          <div class="space-y-3">
            <p class="px-2">
              Search has been replaced with Fuse for local search and Meilisearch for cloud vector search, a couple new
              containers, and beautiful new styling for existing containers.
            </p>
            <p class="p-4 rounded-md bg-primary-950/50 text-primary-300/80">
              Our Layout Controller let's you add unlimited layouts depending on the needs of your documentation. Plus
              we've added build scripts to generate search, make components, and pull in your doc versions with git.
            </p>
            <p class="text-lg font-semibold text-center">Advanced tooling to make it easy!</p>
          </div>
        </template>
      </Card>
      <Card color="info" class="md:col-span-2 lg:col-span-1">
        <template #heading>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" class="w-auto h-5 mr-3" viewBox="0 0 54 33">
            <g clip-path="url(#prefix__clip0)">
              <path
                class="fill-info-950"
                fill-rule="evenodd"
                d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
                clip-rule="evenodd" />
            </g>
            <defs>
              <clipPath id="prefix__clip0">
                <path fill="#fff" d="M0 0h54v32.4H0z" />
              </clipPath>
            </defs>
          </svg>
          <h3 class="text-2xl font-medium text-info-950">Extended Color Gamut</h3>
        </template>
        <template #content>
          <div class="space-y-3">
            <p class="px-2">
              While Tailwind's hex color palette is great and extremely versatile, but since the web is now ready, we've
              converted all colors to the gorgeous LAB/LCH color channel.
            </p>
            <p class="p-4 rounded-md bg-info-950/50 text-info-300/80">
              Along with LCH, we've completely extracted all default colors into a complete set of css custom
              properties. We built in a named color theme using web standards like primary, success and danger. Now ...
            </p>
            <p class="text-lg font-semibold text-center">Go make some gorgeous docs!</p>
          </div>
        </template>
      </Card>
    </div>
    <footer class="grid grid-cols-1 gap-4 pt-4 pb-8 lg:grid-cols-2 text-surface-400 dark:text-surface-600">
      <div class="flex items-center justify-center lg:justify-start">
        Powered by
        <a
          href="https://zenphp.org"
          class="mx-2 underline transition-all duration-500 hover:no-underline hover:text-surface-600 dark:hover:text-surface-400"
          target="_blank"
          rel="noopener nofollow"
          >Doczilla,</a
        >
        <a
          href="https://vitepress.dev"
          class="mr-2 underline transition-all duration-500 hover:no-underline hover:text-surface-600 dark:hover:text-surface-400"
          target="_blank"
          rel="noopener nofollow"
          >VitePress</a
        >
        <a
          href="https://tailwindcss.com"
          class="underline transition-all duration-500 hover:no-underline hover:text-surface-600 dark:hover:text-surface-400"
          target="_blank"
          rel="noopener nofollow"
          >TailwindCSS.</a
        >
      </div>
      <div class="flex items-center justify-center lg:justify-end">
        &copy;{{ year }} {{ company }}. All Rights Reserved.
      </div>
    </footer>
  </main>
</template>
