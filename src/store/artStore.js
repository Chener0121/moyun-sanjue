import { defineStore } from 'pinia';

export const useArtStore = defineStore('art', {
  state: () => ({
    artworkUrl: null,
  }),
  actions: {
    setArtwork(url) {
      this.artworkUrl = url;
    },
  },
});