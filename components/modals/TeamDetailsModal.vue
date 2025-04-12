<script setup>
const coach = defineModel('coach');
const stadium = defineModel('stadium');

const emit = defineEmits(['cancel', 'save']);
</script>

<template>
  <Modal title="Edit Team Details">
    <template #content>
      <div class="space-y-4 mb-6">
        <TextInput v-model="coach" label="Coach" placeholder="Coach name" />
        <TextInput
          v-model="stadium"
          label="Stadium"
          placeholder="Stadium name"
        />
      </div>
    </template>
    <template #controls>
      <Button label="Cancel" type="secondary" @click="emit('cancel')" />
      <Button label="Save Details" type="primary" @click="emit('save')" />
    </template>
  </Modal>
</template>
