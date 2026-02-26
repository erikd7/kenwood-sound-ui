<template>
  <iframe :id="id" :src="source"> </iframe>
</template>

<script setup>
const { id, source } = defineProps({
  id: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
})
</script>
