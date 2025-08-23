<script setup>
import Logo from "../image/logo/Logo_ohne_Text.webp";
import LogoText from "../image/logo/Logo_nur_Text.png";
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
          expand-on-hover
          permanent
          rail
      >
        <v-list>
          <v-list-item>
            <template #prepend>
              <!-- Logo-Bild immer sichtbar -->
              <v-img
                  :src="Logo"
                  width="40"
                  height="40"
                  class="rounded-none"
                  contain
              ></v-img>
            </template>

            <!-- Logoschrift nur im ausgeklappten Zustand -->
            <template #default>
              <v-img
                  v-if="drawer"
                  :src="LogoText"
                  height="40"
                  class="ml-2"
                  contain
              ></v-img>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
          <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>