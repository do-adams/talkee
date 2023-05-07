<template>
  <v-app>
    <v-main>
      <default-layout>
        <router-view />
      </default-layout>
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
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useErrorSnackbar } from '@/composables/useErrorSnackbar'

const { message, showSnackbar } = useErrorSnackbar()
</script>
