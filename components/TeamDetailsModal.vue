<script setup>
const coach = defineModel('coach');
const stadium = defineModel('stadium');

const emit = defineEmits(['cancel', 'save']);
</script>

<template>
  <Modal title="Edit Team Details">
    <template #content>
      <div class="space-y-4 mb-6">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Coach</label
          >
          <input
            v-model="coach"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Coach name"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >Stadium</label
          >
          <input
            v-model="stadium"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Stadium name"
          />
        </div>
      </div>
    </template>
    <template #controls>
      <button
        @click="emit('cancel')"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
      >
        Cancel
      </button>
      <button
        @click="emit('save')"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
      >
        Save Details
      </button>
    </template>
  </Modal>
</template>
