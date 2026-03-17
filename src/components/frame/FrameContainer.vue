<template>
  <div class="frame-container">
    <Framer
      v-for="source in enabledSources"
      :id="`source-${source.id}`"
      :key="source.id"
      :source="source.source"
      :class="['source-frame', { 'source-frame-active': source.id === activeSourceId }]"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import sources from '@/data/sources'
import Framer from './Framer.vue'

const { activeSourceId } = defineProps({
  activeSourceId: {
    type: String,
    required: true,
  },
})

const enabledSources = computed(() => Object.values(sources).filter((source) => source.enabled))
</script>

<style scoped>
.frame-container {
  position: relative;
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.frame-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.source-frame {
  position: absolute;
  inset: 0;
  visibility: hidden;
  pointer-events: none;
}

.source-frame-active {
  visibility: visible;
  pointer-events: auto;
}
</style>
