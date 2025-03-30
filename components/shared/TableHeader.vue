<script setup>
const {
  text,
  isSorted = false,
  sortDirection = 'asc',
  isHoverable = true,
} = defineProps(['text', 'isSorted', 'sortDirection', 'isHoverable']);

const emit = defineEmits(['toggleSort']);
</script>

<template>
  <th
    scope="col"
    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
    :class="{
      'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600': isHoverable,
    }"
    @click="emit('toggleSort')"
  >
    <div class="flex items-center space-x-1">
      <span>{{ text }}</span>
      <SortChevron v-if="isSorted" :direction="sortDirection" />
    </div>
  </th>
</template>
