<script setup>
const { result } = defineProps(['result']);

const color = computed(() => {
  switch (result) {
    case 'W':
      return 'bg-green-500';
    case 'L':
      return 'bg-red-500';
    default:
      return 'bg-yellow-500';
  }
});
</script>

<template>
  <span
    class="w-6 h-6 flex items-center justify-center text-white text-xs font-bold rounded-full"
    :class="color"
  >
    {{ result }}
  </span>
</template>
