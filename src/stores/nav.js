import { defineStore } from 'pinia'
import sources from '@/data/sources'

export const useNavStore = defineStore('nav', {
  state: () => ({
    activeTabId: '',
  }),
  getters: {
    activeTab: (state) =>
      state.activeTabId || Object.keys(sources).find((id) => sources[id].default) || '',
    activeTabSource: function (state) {
      return sources[this.activeTab]
    },
    isActive: function (state) {
      return (id) => this.activeTab === id
    },
  },
  actions: {
    setActiveTab(value) {
      this.activeTabId = value
    },
  },
})
