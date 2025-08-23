import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    { path: '/', name: 'FoodTinder', component: () => import('../pages/food/FoodTinder.vue') },
    { path: '/food/:id', name: 'food-detail', component: () => import('../pages/food/FoodDetail.vue'), props: true },
    { path: '/food-list', name: 'FoodList', component: () => import('../pages/food/FoodList.vue') }, // Example path for the selected list
    { path: '/archive', name: 'FoodArchive', component: () => import('../pages/food/FoodArchive.vue') }, // New route for the archive
    { path: '/quests', component: () => import('../pages/QuestBoard.vue') },
];
export default createRouter({ history: createWebHistory(), routes });