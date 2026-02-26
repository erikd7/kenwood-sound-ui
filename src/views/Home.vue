<template>
  <div class="home-container">
    <FrameContainer :source="activeTabSource" />
    <BarContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BarContainer from '@/components/bar/BarContainer.vue'
import FrameContainer from '@/components/frame/FrameContainer.vue'
import { useNavStore } from '@/stores/nav'

const navStore = useNavStore()
const activeTabSource = computed(() => navStore.activeTabSource?.source)
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
