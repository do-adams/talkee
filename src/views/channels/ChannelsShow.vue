<template>
  <h1>Channel</h1>
  <h3>{{ channel.name }}</h3>
  <section>
    <v-layout>
      <v-row class="justify-center">
        <v-col cols="10" sm="8" lg="6">
          <v-card>
            <v-card-text>
              <v-list ref="messageList" class="message-list">
                <!-- TODO: Use timestamp from Firestore as the key value -->
                <v-list-item v-for="(message, index) in messages" :key="index">
                  {{ message.text }}
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-divider class="my-3"></v-divider>
            <v-card-actions>
              <v-form
                ref="messageForm"
                class="w-100"
                @submit.prevent="onSubmitMessage"
                validate-on="submit"
              >
                <v-row class="justify-center">
                  <v-col cols="8">
                    <v-text-field
                      type="text"
                      v-model.trim="form.message"
                      label="Message"
                      :rules="[rules.required]"
                      clearable
                      :disabled="isLoading"
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-btn
                      class="h-75"
                      type="submit"
                      variant="tonal"
                      icon="mdi mdi-send"
                      size="large"
                      :disabled="isLoading"
                    >
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </section>
</template>

<script setup lang="ts">
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useErrorSnackbar } from '@/composables/useErrorSnackbar'
import { HOME } from '@/router/namedRoutes'
import { doc, getDoc, getFirestore, serverTimestamp } from 'firebase/firestore'
import type { Channel, Message } from '@/firebase/firestore/types'
import { requiredRule } from '@/utils/validators'
import { useAuthStore } from '@/stores/auth'
import type { VForm } from 'vuetify/lib/components/VForm/index'
import type { VList } from 'vuetify/lib/components/VList/index'

const db = getFirestore()
const authStore = useAuthStore()

const route = useRoute()
const channelId = route.params.id as string

const channel = ref<Channel>({
  creatorUid: '',
  name: '',
  createdAt: ''
})

getChannelById(channelId).then(({ channel: ch, snapshot }) => {
  channel.value = ch
})

const messageList = ref<InstanceType<typeof VList> | null>(null)
const messageForm = ref<InstanceType<typeof VForm> | null>(null)

const messages = reactive<Message[]>([])

const isLoading = ref(false)

const form = reactive({
  message: '',
  error: ''
})

const rules = reactive({
  required: requiredRule('Please enter a message')
})

const onSubmitMessage = async () => {
  const validation = await messageForm.value?.validate()

  if (!validation?.valid) return

  try {
    isLoading.value = true
    form.error = ''

    const newMessage: Message = {
      authorUid: authStore.isAuthenticated ? authStore.user.uid : null,
      text: form.message,
      audioURL: null,
      createdAt: serverTimestamp()
    }

    messages.push(newMessage)

    form.message = ''

    await nextTick()

    const messageListElem = messageList.value?.$el as Element | undefined

    messageListElem?.scroll({
      behavior: 'smooth',
      top: messageListElem?.scrollHeight
    })
  } catch (error) {
    form.error = 'There was an error creating your message. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<script lang="ts">
async function getChannelById(channelId: string) {
  const db = getFirestore()
  const snapshot = await getDoc(doc(db, 'channels', channelId))

  if (!snapshot.exists()) throw new Error('Channel not found. Please try a different one.')

  const channel = snapshot.data() as Channel

  return {
    channel,
    snapshot
  }
}

export default defineComponent({
  async beforeRouteEnter(to) {
    try {
      const channelId = to.params.id as string
      await getChannelById(channelId)
      return true
    } catch (error) {
      if (error instanceof Error) {
        const { message } = useErrorSnackbar()
        message.value = error.message

        return { name: HOME }
      } else {
        throw error
      }
    }
  }
})
</script>

<style scoped>
.message-list {
  min-height: 200px;
  max-height: 200px;
}
</style>
