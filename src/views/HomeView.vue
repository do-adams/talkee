<template>
  <h1>Home View</h1>
  <p>Is signed in? {{ isAuthenticated }}</p>
  <p>
    <code>
      {{ user }}
    </code>
  </p>
  <button v-if="isAuthenticated" @click="onSignOut">Sign Out</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { getAuth, signOut } from 'firebase/auth'

const { user, isAuthenticated } = storeToRefs(useAuthStore())
const auth = getAuth()

const onSignOut = () => {
  signOut(auth)
}
</script>
