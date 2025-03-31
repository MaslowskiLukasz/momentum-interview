<script setup>
const { label, type } = defineProps(['label', 'type']);
const emit = defineEmits(['click']);

const style = computed(() => {
  switch (type) {
    case 'secondary':
      return 'px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none';
    case 'primary':
      return 'px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none';
    default:
      return 'px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none';
  }
});
</script>

<template>
  <button @click="emit('click')" :class="style">
    <slot name="left" />
    {{ label }}
  </button>
</template>
