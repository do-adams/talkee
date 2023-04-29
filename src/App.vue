<template>
  <v-app>
    <v-main>
      <talkee-layout>
        <router-view />
      </talkee-layout>
      <v-snackbar v-model="showSnackbar">
        {{ message }}
        <template #actions>
          <v-btn color="pink" variant="text" @click="showSnackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import TalkeeLayout from '@/layouts/TalkeeLayout.vue'
import { useErrorSnackbar } from '@/composables/useErrorSnackbar'

const { message, showSnackbar } = useErrorSnackbar()
</script>
