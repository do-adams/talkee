<template>
  <v-layout id="inspire">
    <v-app-bar flat>
      <v-container class="fill-height d-flex align-center">
        <v-avatar class="me-10 ms-4" color="grey-darken-1" size="32"></v-avatar>

        <v-btn v-for="link in links" :to="link" :key="link.name" variant="text">
          {{ link.text }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-responsive max-width="260">
          <v-text-field density="compact" hide-details variant="solo"></v-text-field>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item v-for="n in 5" :key="n" link>
                  <!-- <v-list-item-title> List Item {{ n }} </v-list-item-title> -->
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link color="grey-lighten-4">
                  <!-- <v-list-item-title> Refresh </v-list-item-title> -->
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <slot></slot>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CHANNELS_NEW, SIGN_IN, SIGN_OUT, HOME } from '@/router/namedRoutes'
import type { RouteLocationNamedRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

type NavigationLink = RouteLocationNamedRaw & { text: string; disabled?: boolean }

const links = computed<NavigationLink[]>(() =>
  [
    { name: HOME, text: 'Home' },
    { name: CHANNELS_NEW, text: 'New Channel' },
    { name: SIGN_IN, text: 'Sign In', disabled: auth.isAuthenticated },
    { name: SIGN_OUT, text: 'Sign Out', disabled: !auth.isAuthenticated }
  ].filter((l) => !l.disabled)
)
</script>
