import { defineStore } from 'pinia';

export const useEcgCanvasStore = defineStore({
  id: 'canvas',
  state: () => ({
    canvasIns: null,
  }),
  actions: {
    setCanvasIns(canvasIns: any) {
      this.canvasIns = canvasIns;
    },
  },
  getters: {
    getCanvasIns(): any {
      return this.canvasIns;
    },
  },
});

export default useEcgCanvasStore;
