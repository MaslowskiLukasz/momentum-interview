<script setup>
const coach = defineModel('coach');
const stadium = defineModel('stadium');

const emit = defineEmits(['cancel', 'save']);
</script>

<template>
  <Modal title="Edit Team Details">
    <template #content>
      <div class="space-y-4 mb-6">
        <TextInput label="Coach" placeholder="Coach name" v-model="coach" />
        <TextInput
          label="Stadium"
          placeholder="Stadium name"
          v-model="stadium"
        />
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
