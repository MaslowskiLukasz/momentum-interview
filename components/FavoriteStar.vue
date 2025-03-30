<script setup>
const { isFavorite } = defineProps(['isFavorite']);
const emit = defineEmits(['toggleFavorite']);
</script>

<template>
  <button
    @click.stop="emit('toggleFavorite')"
    class="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    :class="{
      'bg-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
        isFavorite,
      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600':
        !isFavorite,
    }"
    title="Set as favorite team"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="0"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  </button>
</template>
