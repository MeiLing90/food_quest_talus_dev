import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', component: () => import('../pages/food/FoodSwiper.vue') },
    { path: '/food/selected', name: 'food-selected', component: () => import('../pages/food/FoodList.vue') },
    { path: '/food/:id', name: 'food-detail', component: () => import('../pages/food/FoodDetail.vue'), props: true },
    { path: '/archive', name: 'FoodArchive', component: () => import('../pages/food/FoodArchive.vue') }, // New route for the archive
    { path: '/quests', component: () => import('../pages/QuestBoard.vue') },
];
export default createRouter({ history: createWebHistory(), routes });