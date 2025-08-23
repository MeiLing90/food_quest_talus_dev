import { defineStore } from 'pinia';
import cardsData from '../food.json';

export const useFoodStore = defineStore('food', {
    state: () => ({
        cards: cardsData,
        currentIndex: 0,
    }),
    getters: {
        currentCard: (state) => state.cards[state.currentIndex] || null,
        selectedCards: (state) => state.cards.filter(card => card.selected),
    },
    actions: {
        vote(isYes) {
            if (this.currentCard) {
                this.currentCard.selected = isYes;
                this.currentIndex++;
            }
        },
    },
    // Add this line to make the store persistent
    persist: true,
});