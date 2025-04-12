<script lang="ts" setup>
interface Props {
  label: string;
  value: string | number;
  color?: string;
}

const { label, value, color = 'dark:text-white' } = defineProps<Props>();
</script>

<template>
  <div class="text-center">
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
    <p class="text-2xl font-bold" :class="color">
      {{ value }}
    </p>
  </div>
</template>
