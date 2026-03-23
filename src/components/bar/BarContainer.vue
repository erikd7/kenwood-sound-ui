<template>
  <div class="bar-container"><Nav /><QuickControl /></div>
</template>

<script setup>
import Nav from './Nav.vue'
import QuickControl from './QuickControl.vue'
</script>

<style scoped>
.bar-container {
  height: 65px;
  flex-shrink: 0;
  padding: 10px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  background-color: #685d5d;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
