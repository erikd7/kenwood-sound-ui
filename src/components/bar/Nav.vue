<template>
  <div class="nav-container">
    <NavTab v-for="source in sources" :key="source.name" :source="source" />
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
