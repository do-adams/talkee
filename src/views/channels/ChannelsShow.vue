<template>
  <h1>Channel</h1>
  <h3>{{ channel.name }}</h3>
  <section>
    <form @submit.prevent>
      <v-list></v-list>
    </form>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { HOME } from '@/router/namedRoutes'
import {
  doc,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  query,
  type DocumentData
} from 'firebase/firestore'
import type { Channel } from '@/firebase/firestore/types'
import { useErrorSnackbar } from '@/composables/useErrorSnackbar'

let channelSnapshot: DocumentSnapshot<DocumentData>

export default defineComponent({
  setup() {
    const db = getFirestore()

    const channel = ref<Channel>(channelSnapshot.data() as Channel)

    return {
      channel
    }
  },
  async beforeRouteEnter(to) {
    const db = getFirestore()
    const channelId = to.params.id as string
    const snapshot = await getDoc(doc(db, 'channels', channelId))

    if (!snapshot.exists()) {
      const { message } = useErrorSnackbar()
      message.value = 'Channel not found. Please try a different one.'

      return { name: HOME }
    }

    channelSnapshot = snapshot
    return true
  }
})
</script>
