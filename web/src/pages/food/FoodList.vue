<script setup>
import { useFoodStore } from '../../stores/foodStore'; // Adjust path if needed

const foodStore = useFoodStore();
</script>

<template>
  <v-container>
    <v-row>
      <v-col
          v-for="(card, index) in foodStore.selectedCards"
          :key="index"
          cols="12" sm="6" md="4" lg="3" xl="2"
          class="d-flex">
        <v-card max-width="300" class="w-100" :href="`foodDetail.html?id=${card.id}`">
          <img :src="card.image" class="carouselImage w-100 rounded-md" />
          <v-card-title>{{ card.name }}</v-card-title>
          <v-card-text>{{ card.description }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.carouselImage {
  aspect-ratio: 3 / 4;
  object-fit: cover;
}
</style>