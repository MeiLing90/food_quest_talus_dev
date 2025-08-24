<script setup>
import { useFoodStore } from '../../stores/foodStore'
import { ref } from 'vue'

const foodStore = useFoodStore()
const flipped = ref(false)

function voting(val) {
  foodStore.vote(val);
  flipped.value = false;

}
</script>

<template>
  <v-container class="d-flex justify-center">
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
            @click="voting(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
            color="success"
            class="rounded-circle mx-2"
            width="60"
            height="60"
            @click="voting(true)"
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
.flip-container {
  perspective: 1000px;
  width: 300px;
  min-height: 450px; /* gleiche Höhe wie deine Karten */
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

.flipper.flipped {
  transform: rotateY(180deg);
}

.front,
.back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}
.carouselImage {
  aspect-ratio: 2 / 3;
  object-fit: cover;
}
</style>
