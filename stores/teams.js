import { defineStore } from "pinia";

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref([]);
  const selectedTeam = ref(null);

  return { teams, selectedTeam }
})