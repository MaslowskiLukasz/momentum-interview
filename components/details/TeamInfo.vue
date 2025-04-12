<script lang="ts" setup>
interface Props {
  team: TeamWithStats;
}

const { team } = defineProps<Props>();
const emit = defineEmits<{ editTeamInfo: [] }>();
</script>

<template>
  <div class="p-6">
    <div
      class="flex flex-col md:flex-row md:justify-between md:items-start gap-6"
    >
      <TeamDetails :team="team" @edit-team-info="emit('editTeamInfo')" />
      <TeamStats :team="team" />
    </div>
  </div>
</template>
