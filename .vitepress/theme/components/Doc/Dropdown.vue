<script setup>
const props = defineProps({
  align: {
    type: String,
    default: 'right',
  },
  width: {
    type: String,
    default: '48',
  },
  contentClasses: {
    type: String,
    default: 'py-1 bg-white dark:bg-surface-950 rounded-md',
  },
});

const open = ref(false);
const dropdownRef = ref(null);

const closeOnEscape = (e) => {
  if (open.value && e.key === 'Escape') {
    open.value = false;
  }
};

const onClickOutside = (event) => {
  const target = event.target;

  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener('keydown', closeOnEscape);
  document.addEventListener('click', onClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape);
  document.removeEventListener('click', onClickOutside, true);
});

const widthClass = computed(() => {
  return {
    48: 'w-48',
  }[props.width.toString()];
});

const alignmentClasses = computed(() => {
  if (props.align === 'left') {
    return 'origin-top-left left-0';
  } else if (props.align === 'right') {
    return 'origin-top-right right-0';
  } else {
    return 'origin-top';
  }
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <div @click="open = !open">
      <slot name="trigger" />
    </div>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0">
      <div
        v-show="open"
        class="absolute z-50 mt-2 shadow-lg"
        :class="[widthClass, alignmentClasses]"
        style="display: none"
        @click="open = false">
        <div class="ring-1 ring-black ring-opacity-5" :class="contentClasses">
          <slot name="content" />
        </div>
      </div>
    </transition>
  </div>
</template>
