<script setup>
const { label, value } = defineProps(['label', 'value']);
</script>

<template>
  <div class="flex items-center space-x-2">
    <slot name="left" />
    <p class="dark:text-gray-300">
      <strong>{{ label }}:</strong> {{ value }}
      <slot name="right" />
    </p>
  </div>
</template>
