<script setup>
const props = defineProps({
  color: {
    type: String,
    required: true,
  },
});

const colorClasses = computed(() => {
  const classes = {
    primary:
      'text-primary-950 bg-gradient-to-br from-amber-600 from-10% via-primary-500 via-60% to-primary-400 to-90% dark:shadow-primary-900 border border-primary-600/50 dark:border-primary-400',
    secondary:
      'text-secondary-950 bg-gradient-to-br from-purple-600 from-10% via-secondary-500 via-50% to-secondary-400 to-90% dark:shadow-secondary-900 border border-secondary-600/50 dark:border-secondary-400',
    success:
      'text-success-950 bg-gradient-to-br from-green-700 from-10% via-success-500 via-60% to-success-400 to-90% dark:shadow-success-900 border border-success-600/50 dark:border-success-400',
    warning:
      'text-warning-950 bg-warning-500 dark:shadow-warning-900 border border-warning-600/50 dark:border-warning-400',
    info: 'text-info-950 bg-gradient-to-br from-sky-600 from-10% via-info-500 via-60% to-info-400 to-90% dark:shadow-info-900 border border-info-600/50 dark:border-info-400',
    danger:
      'text-danger-950 bg-gradient-to-br from-red-700 from-10% via-danger-500 via-60% to-danger-400 to-90% dark:shadow-danger-900 border border-danger-600/50 dark:border-danger-400',
  };

  return classes[props.color];
});
</script>

<template>
  <div
    class="px-4 py-3 mt-10 rounded-lg shadow-2xl lg:mt-0 dark:shadow-xl shadow-surface-900/80"
    :class="[colorClasses]">
    <div class="flex items-center justify-start">
      <slot name="heading" />
    </div>
    <div class="px-2 pb-2 mt-3">
      <slot name="content" />
    </div>
  </div>
</template>
