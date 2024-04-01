<script setup>
const isVisible = ref(false);

const watchDisplay = () => {
  isVisible.value = window.scrollY > 600;
};

const backToTop = () => {
  document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  document.addEventListener('scroll', watchDisplay, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener('scroll', watchDisplay);
});
</script>

<template>
  <transition name="fade">
    <button
      v-show="isVisible"
      type="button"
      class="fixed bottom-0 right-0 z-50 flex items-center w-10 h-10 mb-5 mr-10 text-white rounded-full shadow-xl bg-primary-500 focus:bg-primary-600 focus:outline-none"
      @click.prevent="backToTop">
      <i class="icon-[heroicons--chevron-up-solid] w-6 h-6 mx-auto" />
    </button>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
