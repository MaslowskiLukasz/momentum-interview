<script lang="ts" setup>
interface Props {
  label: string;
}

const { label } = defineProps<Props>();
const model = defineModel<number>();
</script>

<template>
  <div>
    <InputLabel :value="label" />
    <input
      v-model.number="model"
      type="number"
      min="0"
      max="7"
      class="w-16 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
    >
  </div>
</template>
