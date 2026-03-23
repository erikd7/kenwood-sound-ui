<template>
  <div class="nav-container">
    <div v-for="source in sources" :key="source.name">
      <NavTab v-if="source.enabled" :source="source" />
    </div>
  </div>
</template>

<script setup>
import sources from '@/data/sources'
import NavTab from './NavTab.vue'
</script>

<style scoped>
.nav-container {
  display: flex;
  align-items: center;
}
</style>
