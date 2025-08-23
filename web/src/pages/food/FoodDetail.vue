<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFoodStore } from '../../stores/foodStore';
import UiParentCard from "../../components/UiParentCard.vue";
import Chatbox from "../../components/chatbox.vue";

const route = useRoute();
const foodStore = useFoodStore();

const card = computed(() =>
    cardsData.find(c => String(c.id) === id)
)


    foodStore.allCards.find(c => String(c.id) === route.params.id)
);
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
          <hr class="my-4">

          <v-card-text>
            <h2>Instructions</h2>
            <div v-html="card.instructions"></div>
          </v-card-text>
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