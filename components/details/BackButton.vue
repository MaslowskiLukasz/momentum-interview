<script setup>
const { label } = defineProps(['label']);
const emit = defineEmits(['goBack']);
</script>

<template>
  <button
    @click="emit('goBack')"
    class="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
  >
    <ArrowLeft />
    {{ label }}
  </button>
</template>
