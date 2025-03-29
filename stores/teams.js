import { defineStore } from "pinia";

export const useTeamsStore = defineStore('teams', () => {
  const teams = ref([]);

  return { teams }
})