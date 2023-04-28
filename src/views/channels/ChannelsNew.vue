<template>
  <v-container>
    <section class="py-5">
      <div class="pb-5 text-center">
        <h4 class="mb-2 text-h4">Get started</h4>
        <p class="pl-1 text-subtitle-1 text-medium-emphasis">Create a new channel</p>
      </div>
      <div class="pt-5">
        <v-form ref="formComponent" @submit.prevent="onCreateChannel" v-model="form.isValid">
          <v-row v-if="form.error" justify="center">
            <v-col cols="8" md="6">
              <v-alert type="error" :text="form.error"></v-alert>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="8" sm="6" md="4">
              <v-text-field
                class="mb-2"
                type="text"
                v-model="form.name"
                :rules="[rules.required]"
                label="Name"
                :disabled="isLoading"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-5" justify="center">
            <v-btn type="submit" :disabled="isLoading" variant="outlined" prepend-icon="mdi-radio">
              <template v-slot:prepend>
                <v-icon></v-icon>
              </template>
              Create
            </v-btn>
          </v-row>
        </v-form>
      </div>
    </section>
  </v-container>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CHANNELS_SHOW } from '@/router/namedRoutes'
import { requiredRule } from '@/utils/validators'
import { useAuthStore } from '@/stores/auth'
import { getFirestore, serverTimestamp, addDoc, collection } from 'firebase/firestore'
import type { Channel } from '@/firebase/firestore/types'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)

const form = reactive({
  isValid: false,
  name: '',
  error: ''
})

const rules = reactive({
  required: requiredRule()
})

const createNewDbChannel = async (name: string) => {
  const db = getFirestore()

  const newChannel: Channel = {
    creatorUid: authStore.userId,
    name: name,
    createdAt: serverTimestamp()
  }

  const channelsRef = collection(db, 'channels')
  const newChannelRef = await addDoc(channelsRef, newChannel)

  return newChannelRef.id
}

const onCreateChannel = async () => {
  if (!form.isValid) return

  try {
    isLoading.value = true
    form.error = ''

    const channelId = await createNewDbChannel(form.name)

    router.push({
      name: CHANNELS_SHOW,
      params: {
        id: channelId
      }
    })
  } catch (error) {
    form.error = 'There was an error creating your channel. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
