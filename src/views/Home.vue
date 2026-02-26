<template>
  <div class="home-container">
    <FrameContainer :source="activeTabSource" />
    <BarContainer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BarContainer from '@/components/bar/BarContainer.vue'
import FrameContainer from '@/components/frame/FrameContainer.vue'
import sources from '@/data/sources'

const route = useRoute()
const activeTabSource = computed(() => {
  const sourceId = route.params.sourceId
  return sources[sourceId]?.source || ''
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
