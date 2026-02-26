<template>
  <div class="frame-container">
    <Framer v-if="source" :id="`source-${source}`" :source="source" />
    <div v-else class="text-center m-10">Select a source from the control bar below</div>
  </div>
</template>

<script setup>
import Framer from './Framer.vue'

const { source } = defineProps({
  source: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.frame-container {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.frame-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
