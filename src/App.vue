<template>
  <v-app>
    <v-main>
      <talkee-layout>
        <router-view />
      </talkee-layout>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import TalkeeLayout from '@/layouts/TalkeeLayout.vue'
</script>
