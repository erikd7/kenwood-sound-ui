<template>
  <div
    class="liquid-glass"
    role="region"
    ref="root"
    @pointermove="onPointerMove"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
  >
    <div class="ripple" :class="{ active: rippleActive, pulse: pulse }" :style="rippleStyle"></div>
    <div><slot /></div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'

const root = ref(null)
const rippleX = ref(0)
const rippleY = ref(0)
const rippleActive = ref(false)
const pulse = ref(false)
let pulseTimeout = null

const rippleStyle = computed(() => ({
  left: rippleX.value + 'px',
  top: rippleY.value + 'px',
}))

function onPointerMove(e) {
  if (!root.value) return
  const rect = root.value.getBoundingClientRect()
  rippleX.value = e.clientX - rect.left
  rippleY.value = e.clientY - rect.top
}

function onPointerEnter(e) {
  onPointerMove(e)
  rippleActive.value = true
}

function onPointerLeave() {
  rippleActive.value = false
  pulse.value = false
}

function onPointerDown(e) {
  onPointerMove(e)
  pulse.value = true
  clearTimeout(pulseTimeout)
  pulseTimeout = setTimeout(() => (pulse.value = false), 420)
}

onBeforeUnmount(() => clearTimeout(pulseTimeout))
</script>

<style scoped>
.liquid-glass {
  position: relative;
  display: inline-block;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 220, 230, 0.06); /* subtle silver outline */
  box-shadow:
    0 1px 10px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(220, 220, 230, 0.02);
  overflow: hidden;
  transition:
    backdrop-filter 2.4s ease,
    opacity 1.6s ease,
    transform 0.28s ease;
}

/* ripple element positioned at pointer */
.ripple {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%) scale(0.6);
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.18) 0%,
    rgba(255, 255, 255, 0.06) 35%,
    transparent 10%
  );
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  transition:
    transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 420ms ease;
}
.ripple {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transform: translate(-50%, -50%) scale(0.7);
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 0.32) 0%,
    rgba(255, 255, 255, 0.12) 40%,
    transparent 65%
  );
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  transition:
    transform 360ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 360ms ease;
}
.ripple.active {
  opacity: 0.18;
  transform: translate(-50%, -50%) scale(1.15);
}
.ripple.pulse {
  opacity: 0.36;
  transform: translate(-50%, -50%) scale(2.6);
  transition:
    transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 260ms ease;
}
</style>
