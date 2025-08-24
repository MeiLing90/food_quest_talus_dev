<!-- FoodSwiper.vue -->
<script setup>
import { ref } from 'vue'
import { useFoodStore } from '../../stores/foodStore'

const foodStore = useFoodStore()
const flipped = ref(false)

// Top popup state (fixed position, fades away after 1s)
const toastShow = ref(false)
const toastText = ref('')
const toastKind = ref('success') // 'success' | 'error'
let toastTimer

function showTopToast(text, kind = 'success') {
  toastText.value = text
  toastKind.value = kind
  toastShow.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastShow.value = false }, 1000)
}

function voting(val) {
  const name = foodStore.currentCard?.name || 'Recipe'
  if (val) showTopToast(`Saved “${name}”`, 'success')
  else     showTopToast(`Skipped “${name}”`, 'error')

  foodStore.vote(val)
  flipped.value = false
}
</script>

<template>
  <v-container class="d-flex justify-center">
    <!-- Top fading popup (fixed; won't interfere with flip) -->
    <transition name="toast-fade">
      <div v-if="toastShow" :class="['top-toast', toastKind]">
        <span class="icon">{{ toastKind === 'success' ? '✔' : '✕' }}</span>
        <span>{{ toastText }}</span>
      </div>
    </transition>

    <div v-if="foodStore.currentCard" class="flip-container">
      <div class="flipper" :class="{ flipped }" @click="flipped = !flipped">
        <!-- FRONT -->
        <v-card class="front" max-width="300">
          <img
              :src="foodStore.currentCard.image"
              class="carouselImage w-100 rounded-md"
          />
          <v-card-title>{{ foodStore.currentCard.name }}</v-card-title>
        </v-card>

        <!-- BACK -->
        <v-card class="back" max-width="300">
          <v-card-text>
            {{ foodStore.currentCard.description || 'Keine Beschreibung vorhanden' }}
          </v-card-text>
        </v-card>
      </div>

      <v-row class="justify-center mt-2">
        <v-btn
            color="error"
            class="rounded-circle mx-2"
            width="60"
            height="60"
            @click.stop="voting(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
            color="success"
            class="rounded-circle mx-2"
            width="60"
            height="60"
            @click.stop="voting(true)"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-row>
    </div>

    <div v-else>
      <p>No more recipes</p>
      <v-btn @click="foodStore.resetStore()">Start Over</v-btn>
    </div>
  </v-container>
</template>

<style scoped>
/* Top toast (fixed, non-interactive) */
.top-toast {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
  background: #fff;
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.top-toast.success { border: 1px solid #4caf50; color: #2e7d32; }
.top-toast.error   { border: 1px solid #e53935; color: #b71c1c; }
.top-toast .icon   { font-size: 16px; line-height: 1; }

/* Fade in/out for toast */
.toast-fade-enter-active,
.toast-fade-leave-active { transition: opacity .22s ease, transform .22s ease; }
.toast-fade-enter-from,
.toast-fade-leave-to { opacity: 0; transform: translate(-50%, -8px); }

/* Flip card styles (unchanged) */
.flip-container {
  perspective: 1000px;
  width: 300px;
  min-height: 450px;
  cursor: pointer;
  margin-bottom: 110px;
}
.flipper {
  position: relative;
  width: 100%;
  height: 113%;
  transition: 0.6s;
  transform-style: preserve-3d;
}
.flipper.flipped { transform: rotateY(180deg); }
.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.back { transform: rotateY(180deg); }
.carouselImage {
  aspect-ratio: 2 / 3;
  object-fit: cover;
}
</style>
