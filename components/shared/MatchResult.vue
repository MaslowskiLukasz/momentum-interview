<script setup>
const { result, size = 6 } = defineProps(['result', 'size']);

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
    class="flex items-center justify-center text-white text-xs font-bold rounded-full"
    :class="[color, `w-${size} h-${size}`]"
  >
    {{ result }}
  </span>
</template>
