<script setup lang="ts">
import { ref } from 'vue';

import { computed } from 'vue'
import cardsData from '../../food.json'
import UiParentCard from "../../components/UiParentCard.vue";

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
      <p>{{ card.description }}</p>

  </UiParentCard>
</template>

<style scoped>
.carouselImage {
  aspect-ratio: 32 / 9;
  object-fit: cover;
}
</style>