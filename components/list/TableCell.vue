<script setup>
const { text } = defineProps(['text']);
</script>

<template>
  <td class="px-6 py-4 whitespace-nowrap">
    <slot>
      <div class="text-sm font-medium text-gray-900 dark:text-white">
        {{ text }}
      </div>
    </slot>
  </td>
</template>
