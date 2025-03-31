<script setup>
const { label, placeholder } = defineProps(['label', 'placeholder']);
const model = defineModel();
</script>

<template>
  <div>
    <InputLabel :value="label" />
    <input
      v-model="model"
      type="text"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      :placeholder="placeholder"
    />
  </div>
</template>
