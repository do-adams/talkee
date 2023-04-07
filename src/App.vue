<template>
  <v-app>
    <v-main>
      <default-layout>
        <router-view />
      </default-layout>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
