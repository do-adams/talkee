<template>
  <h1>Channel</h1>
  <h3>{{ channel?.name }}</h3>
  <p>{{ error }}</p>
</template>

<script setup lang="ts">
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import type { Channel } from '@/firebase/firestore/types'
import { onBeforeMount, ref } from 'vue'

const route = useRoute()

const db = getFirestore()

const channel = ref<Channel>()
const error = ref('')

onBeforeMount(async function setChannel() {
  const channelId = route.params.id as string
  const snapshot = await getDoc(doc(db, 'channels', channelId))

  if (snapshot.exists()) {
    channel.value = snapshot.data() as Channel
  } else {
    // TODO: Handle error in nav guard
    error.value = 'Channel not found.'
  }
})
</script>
