<script setup lang="ts">
import { computed } from 'vue'
import cardsData from '../../food.json'
import UiParentCard from "../../components/UiParentCard.vue";
import Chatbox from "../../components/chatbox.vue";

// ID aus URL holen
const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("id") ?? "1"   // fallback = 1

const card = computed(() =>
    cardsData.find(c => String(c.id) === id)
)


</script>

<template>

  <UiParentCard :title="card.name" class="maxWidth">
    <img :src="card.image" class="carouselImage w-100 rounded-md" />
    <v-container>
      <v-row>
        <!-- Linke Seite: Text -->
        <v-col cols="7">
          <p>{{ card.description }}</p>
          <!-- Hier kannst du später weitere Infos einfügen -->
          <p>{{ card.instructions }}</p>
          <p>{{ card.ingredients }}</p>
        </v-col>

        <!-- Rechte Seite: Chatbox -->
        <v-col cols="5">
          <chatbox class="mt-0" ref="chatbox" />
        </v-col>
      </v-row>
    </v-container>
  </UiParentCard>
</template>

<style scoped>
.carouselImage {
  aspect-ratio: 32 / 9;
  object-fit: cover;
}
</style>
