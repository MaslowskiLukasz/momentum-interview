<script lang="ts" setup>
interface Props {
  label: string;
  value: string;
}
const { label, value } = defineProps<Props>();
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
