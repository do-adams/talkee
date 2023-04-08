<template>Sign In</template>

<script setup lang="ts">
import { getAuth, signInAnonymously } from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const auth = getAuth()

signInAnonymously(auth)
</script>
