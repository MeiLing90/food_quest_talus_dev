import { defineStore } from 'pinia';
import cardsData from '../food.json';

export const useFoodStore = defineStore('food', {
    state: () => ({
        // Map the initial data to ensure a `selected` property is present for consistency
        allCards: cardsData.map(card => ({ ...card, selected: undefined })),
        currentIndex: 0,
    }),
    getters: {
        // This getter is the core of your filtering logic
        unvotedCards: (state) => state.allCards.filter(card => card.selected === undefined),
        currentCard: (state) => {
            // The currentIndex now correctly points to the index in the unvotedCards array
            const unvoted = state.allCards.filter(card => card.selected === undefined);
            return unvoted[state.currentIndex] || null;
        },
        selectedCards: (state) => state.allCards.filter(card => card.selected === true),
    },
    actions: {
        vote(isYes) {
            const cardToUpdate = this.currentCard; // Use the getter to get the current card
            if (cardToUpdate) {
                // Find the index of the card in the full `allCards` array
                const cardIndex = this.allCards.findIndex(card => card.id === cardToUpdate.id);
                if (cardIndex !== -1) {
                    // Update the `selected` property of the card in the main array
                    this.allCards[cardIndex].selected = isYes;
                }
            }
        },
        resetStore() {
            // Reset the 'selected' property on all cards to undefined
            this.allCards.forEach(card => card.selected = undefined);
            this.currentIndex = 0;
        }
    },
    persist: true,
});