<template>
  <div
    class="nav-tab hover-grow"
    :class="{ 'nav-tab-active': isActive }"
    :style="`--scale: ${1.08}`"
    :title="source.name"
    @click="onClick"
  >
    <img class="nav-icon" :src="`/icons/${source.icon}`" :alt="source.name || 'icon'" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNavStore } from '@/stores/nav'
const navStore = useNavStore()

const { source } = defineProps({
  source: Object,
})

const onClick = () => {
  console.log(`setting active`, source) /* //!DELETE */
  navStore.setActiveTab(source.id)
}

const isActive = computed(() => navStore.isActive(source.id))
</script>

<style scoped>
.hover-grow {
  transition: all 0.15s ease-in-out;
  transform-origin: 50% 50%;
  transform-box: fill-box;
  -webkit-font-smoothing: subpixel-antialiased;
  will-change: font-size;
}
.hover-grow:hover {
  transform: scale(var(--scale));
  filter: drop-shadow(2px 2px 2px #3f454e00);
}
.nav-container {
  display: flex;
  align-items: center;
}
.nav-tab {
  margin: 0 10px;
  cursor: pointer;
  width: 5em;
}
.nav-tab div {
  text-align: center;
  font-size: 1.3em;
  height: 2em;
  vertical-align: middle;
}
.nav-tab-active img {
  filter: drop-shadow(0 0 4px #f5ebebbd);
}
.nav-icon {
  width: 60px;
  display: block;
}
</style>
