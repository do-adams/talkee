<template>
  <h1>Home View</h1>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { getAuth, signOut } from 'firebase/auth'
</script>
