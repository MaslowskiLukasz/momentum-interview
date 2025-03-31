<script setup>
const { value } = defineProps(['value']);
</script>

<template>
  <label
    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >{{ value }}</label
  >
</template>
