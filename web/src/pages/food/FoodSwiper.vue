<script setup>
import { useFoodStore } from '../../stores/foodStore';

const foodStore = useFoodStore();
</script>

<template>
  <v-container class="d-flex justify-center">
    <div v-if="foodStore.currentCard">
      <v-card max-width="300">
        <img
            :src="foodStore.currentCard.image"
            class="carouselImage w-100 rounded-md"/>

        <v-card-title>{{ foodStore.currentCard.name }}</v-card-title>
      </v-card>

      <v-row class="justify-center mt-2">
        <v-btn
            color="error"
            class="rounded-circle mx-2"
            width="60"
            height="60"
            @click="foodStore.vote(false)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
            color="success"
            class="rounded-circle mx-2"
            width="60"
            height="60"
            @click="foodStore.vote(true)"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-row>
    </div>

    <div v-else>
      <p>Keine weiteren Karten</p>
      <v-btn @click="foodStore.resetStore()">Start Over</v-btn>
    </div>
  </v-container>
</template>

<style scoped>
.carouselImage {
  aspect-ratio: 2 / 3;
  object-fit: cover;
}
</style>