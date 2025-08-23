<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFoodStore } from '../../stores/foodStore.js';
import UiParentCard from "../../components/UiParentCard.vue";
import Chatbox from "../../components/chatbox.vue";

const route = useRoute();
const router = useRouter();
const foodStore = useFoodStore();

const card = computed(() =>
    foodStore.allCards.find(c => String(c.id) === route.params.id)
);

// Get a formatted list of cooked dates
const cookedDates = computed(() => {
  // Corrected check: ensure card.value and its cookedHistory exist
  if (card.value && card.value.cookedHistory) {
    return card.value.cookedHistory.map(dateStr => {
      return new Date(dateStr).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }).reverse(); // Reverse to show most recent first
  }
  return []; // Return an empty array if card or history is undefined
});

function handleCooked() {
  if (!card.value) return

  // 1) Tell backend a recipe with these tags was cooked
  fetch('/api/events/recipe-cooked', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipeId: card.value.id,
      tags: card.value.tags || []     // ← at least one tag overlap triggers quest updates
    })
  }).catch(() => {}) // ignore demo errors

  // 2) Keep your local prototype behavior
  foodStore.markAsCooked(card.value.id)

  // 3) Navigate as you already do
  if (!card.value.cookedHistory.length) {
    router.push({ name: 'FoodList' }) // or to { name: 'quests' } if you prefer
  }
}

const buttonText = computed(() =>
    card.value && card.value.cookedHistory.length > 0 ? 'Cooked again' : 'Mark as Cooked'
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
            <h2>Ingredients</h2>
            <ul>
              <li v-for="ingredient in card.ingredients" :key="ingredient">
                {{ ingredient }}
              </li>
            </ul>
          </v-card-text>

          <v-card-text>
            <h2>Dietary Info</h2>
            <ul>
              <li v-for="tag in card.tags" :key="tags">
                {{ tag }}
              </li>
            </ul>
          </v-card-text>

          <v-card-text>
            <h2>Instructions</h2>
            <div v-html="card.instructions"></div>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn style="color: #56AB2F" @click="handleCooked">{{ buttonText }}</v-btn>
          </v-card-actions>
        </v-col>

        <!-- Rechte Seite: Chatbox -->
        <v-col cols="5">
          <chatbox class="mt-0" ref="chatbox" />
        </v-col>


        <v-card-text v-if="cookedDates.length > 0">
          <h3>History:</h3>
          <ul>
            <li v-for="(date, index) in cookedDates" :key="index">{{ date }}</li>
          </ul>
        </v-card-text>
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