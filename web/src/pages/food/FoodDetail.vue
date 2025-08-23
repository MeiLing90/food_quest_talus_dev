<script setup lang="ts">

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFoodStore } from '../../stores/foodStore'; // Import your Pinia store
import UiParentCard from "../../components/UiParentCard.vue";

const route = useRoute();
const foodStore = useFoodStore();

const card = computed(() =>
    foodStore.allCards.find(c => String(c.id) === route.params.id)
);

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
