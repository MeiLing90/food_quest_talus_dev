import { defineStore } from 'pinia';
import cardsData from '../food.json';

export const useFoodStore = defineStore('food', {
    state: () => ({
        allCards: cardsData.map(card => ({
            ...card,
            selected: undefined,
            cooked: false,
            cookedHistory: []
        })),
        currentIndex: 0,
    }),
    getters: {
        unvotedCards: (state) => state.allCards.filter(card => card.selected === undefined),
        currentCard: (state) => {
            const unvoted = state.allCards.filter(card => card.selected === undefined);
            return unvoted[state.currentIndex] || null;
        },
        selectedCards: (state) => state.allCards.filter(card => card.selected === true && card.cooked === false),
        cookedCards: (state) => state.allCards.filter(card => card.cooked === true),
    },
    actions: {
        vote(isYes) {
            const cardToUpdate = this.currentCard;
            if (cardToUpdate) {
                const cardIndex = this.allCards.findIndex(card => card.id === cardToUpdate.id);
                if (cardIndex !== -1) {
                    this.allCards[cardIndex].selected = isYes;
                }
                this.currentIndex++;
            }
        },
        markAsCooked(id) {
            const cardToUpdate = this.allCards.find(card => card.id === id);
            if (cardToUpdate) {
                cardToUpdate.cooked = true;
                // Add the current timestamp to the cookedHistory array
                cardToUpdate.cookedHistory.push(new Date().toISOString());
            }
        },
        resetStore() {
            this.allCards.forEach(card => {
                card.selected = undefined;
                card.cooked = false;
                card.cookedHistory = [];
            });
            this.currentIndex = 0;
        }
    },
    persist: true,
});