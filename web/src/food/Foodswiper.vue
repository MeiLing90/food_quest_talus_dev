<script setup>
import { ref, computed  } from 'vue';

import cardsData from '../food.json';

const cards = ref(cardsData);

const currentIndex = ref(0);

const currentCard = computed(() => cards.value[currentIndex.value] || null);

function vote(isYes) {
    if (currentCard.value) {
        currentCard.value.selected = isYes;
        currentIndex.value++;
    }
}
</script>

<template>
    <v-container class="d-flex justify-center">
        <div v-if="currentCard">
            <v-card max-width="300">
                <img
                    :src="currentCard.image"
                    class="carouselImage w-100 rounded-md"/>

                <v-card-title>{{ currentCard.name }}</v-card-title>
            </v-card>

            <v-row class="justify-center mt-2">
                <v-btn
                    color="error"
                    class="rounded-circle mx-2"
                    width="60"
                    height="60"
                    @click="vote(false)"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-btn
                    color="success"
                    class="rounded-circle mx-2"
                    width="60"
                    height="60"
                    @click="vote(true)"
                >
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-row>

        </div>

        <div v-else>
            <p>Keine weiteren Karten</p>
        </div>
    </v-container>
</template>

<style scoped>
.carouselImage {
    aspect-ratio: 2 / 3;
    object-fit: cover;
}
</style>