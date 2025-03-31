<script setup>
const { result, size = 'small' } = defineProps(['result', 'size']);

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

const circleSize = computed(() => (size === 'big' ? 'w-10 h-10' : 'w-6 h-6'));
</script>

<template>
  <span
    class="flex items-center justify-center text-white text-xs font-bold rounded-full"
    :class="[color, circleSize]"
  >
    {{ result }}
  </span>
</template>
