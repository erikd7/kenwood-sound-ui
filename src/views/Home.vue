<template>
  <div class="home-container">
    <FrameContainer :active-source-id="activeSourceId" />
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
const defaultSourceId =
  Object.keys(sources).find((id) => sources[id].default && sources[id].enabled) ||
  Object.keys(sources).find((id) => sources[id].enabled) ||
  ''

const activeSource = computed(() => {
  const sourceId = route.params.sourceId
  return sources[sourceId] || sources[defaultSourceId]
})

const activeSourceId = computed(() => {
  return activeSource.value?.id || ''
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
