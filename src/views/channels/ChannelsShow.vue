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

<script lang="ts">
import { defineComponent, nextTick, reactive, ref } from 'vue'
import { HOME } from '@/router/namedRoutes'
import {
  doc,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore'
import type { Channel, Message } from '@/firebase/firestore/types'
import { useErrorSnackbar } from '@/composables/useErrorSnackbar'
import { requiredRule } from '@/utils/validators'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { templateRef } from '@vueuse/core'
import type { VForm } from 'vuetify/lib/components/VForm/index'
import type { VList } from 'vuetify/lib/components/VList/index'

let channelSnapshot: DocumentSnapshot<DocumentData>

export default defineComponent({
  setup() {
    const { userId } = storeToRefs(useAuthStore())
    const db = getFirestore()

    const isLoading = ref(false)

    const channel = ref<Channel>(channelSnapshot.data() as Channel)
    const messages = reactive<Message[]>([])

    const messageList = templateRef<InstanceType<typeof VList> | null>('messageList')
    const messageForm = templateRef<InstanceType<typeof VForm> | null>('messageForm')

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
          authorUid: userId.value,
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

    return {
      isLoading,
      channel,
      messages,
      form,
      rules,
      onSubmitMessage
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

<style scoped>
.message-list {
  min-height: 200px;
  max-height: 200px;
}
</style>
