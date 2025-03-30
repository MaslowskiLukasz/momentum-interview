<script setup>
const {
  label,
  value,
  color = 'dark:text-white',
} = defineProps(['label', 'value', 'color']);
</script>

<template>
  <div class="text-center">
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
    <p class="text-2xl font-bold" :class="color">
      {{ value }}
    </p>
  </div>
</template>
