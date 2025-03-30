<script setup>
const { isFavorite } = defineProps(['isFavorite']);
const emit = defineEmits(['toggleFavorite']);
</script>

<template>
  <button
    @click.stop="emit('toggleFavorite')"
    class="flex gap-1 items-center px-3 py-2 rounded-md transition-colors"
    :class="{
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
        isFavorite,
      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600':
        !isFavorite,
    }"
  >
    <Star />
    {{ isFavorite ? 'Favorite Team' : 'Set as Favorite' }}
  </button>
</template>
