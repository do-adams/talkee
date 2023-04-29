<template>
  <section class="py-5 d-flex justify-center">
    <v-btn
      class="my-5"
      variant="outlined"
      prepend-icon="mdi-incognito"
      :disabled="isLoading"
      @click="onSignInAnonymously"
    >
      <template #prepend>
        <v-icon></v-icon>
      </template>
      Sign In Anonymously
    </v-btn>
  </section>
  <v-progress-linear :indeterminate="isLoading"></v-progress-linear>
  <section ref="formSection" class="mt-5 py-5">
    <v-form @submit.prevent="onSignInOrSignUp" v-model="form.isValid">
      <v-row v-if="form.error" justify="center">
        <v-col cols="8" md="6">
          <v-alert type="error" :text="form.error"></v-alert>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="8" md="6">
          <v-text-field
            class="mb-2"
            type="text"
            v-model="form.email"
            :rules="[rules.required, rules.email]"
            label="E-mail"
            :disabled="isLoading"
          ></v-text-field>
          <v-text-field
            class="mb-2"
            :type="form.showPassword ? 'text' : 'password'"
            :append-inner-icon="form.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="form.showPassword = !form.showPassword"
            v-model="form.password"
            :rules="[rules.required, rules.minLength]"
            label="Password"
            :disabled="isLoading"
          ></v-text-field>
          <v-expand-transition>
            <v-text-field
              class="mb-2"
              v-if="isSigningUp"
              key="confirm-password-field"
              :type="form.showPassword ? 'text' : 'password'"
              :append-inner-icon="form.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="form.showPassword = !form.showPassword"
              v-model="form.confirmPassword"
              :rules="[rules.required, rules.minLength, rules.confirmPassword]"
              label="Confirm Password"
              :disabled="isLoading"
            ></v-text-field>
          </v-expand-transition>
        </v-col>
      </v-row>
      <v-row class="mb-4" justify="center">
        <v-btn
          v-if="isSigningUp"
          type="submit"
          :disabled="isLoading"
          variant="outlined"
          prepend-icon="mdi-card-account-details-outline"
        >
          <template #prepend>
            <v-icon></v-icon>
          </template>
          Sign Up
        </v-btn>
        <v-btn
          v-else
          type="submit"
          :disabled="isLoading"
          variant="outlined"
          prepend-icon="mdi-email"
        >
          <template #prepend>
            <v-icon></v-icon>
          </template>
          Sign In with Email
        </v-btn>
      </v-row>
      <v-row class="mb-5" justify="center">
        <a
          v-if="isSigningUp"
          href="javascript:void(0)"
          class="text-caption"
          @click="toggleSignUp(false)"
          >Already have an account? Sign in</a
        >
        <a v-else href="javascript:void(0)" class="text-caption" @click="toggleSignUp(true)"
          >Don't have an account? Sign up</a
        >
      </v-row>
    </v-form>
  </section>
</template>

<script setup lang="ts">
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  type UserCredential
} from 'firebase/auth'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { computed, reactive, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { requiredRule, emailRule, minLengthRule } from '@/utils/validators'
import { templateRef } from '@vueuse/core'
import { VForm } from 'vuetify/lib/components/index'
import { HOME } from '@/router/namedRoutes'
import type { User } from '@/firebase/firestore/types'

const auth = getAuth()

const route = useRoute()
const router = useRouter()
const redirectTo = computed(() =>
  route.query.redirect_to ? { path: route.query.redirect_to } : { name: HOME }
)

const formSectionElem = templateRef<HTMLElement | null>('formSection')

const isLoading = ref(false)
const isSigningUp = ref(false)

const form = reactive({
  isValid: false,
  email: '',
  password: '',
  confirmPassword: '',
  showPassword: false,
  error: ''
})

const rules = reactive({
  required: requiredRule(),
  email: emailRule(),
  minLength: minLengthRule(6),
  confirmPassword: () => (form.password === form.confirmPassword ? true : 'Passwords must match')
})

const createNewDbUser = async ({ user }: UserCredential) => {
  const db = getFirestore()

  const newUser: User = {
    uid: user.uid,
    email: user.email,
    isAnonymous: user.isAnonymous,
    createdAt: serverTimestamp()
  }

  const newUserRef = doc(db, 'users', newUser.uid)
  await setDoc(newUserRef, newUser)
}

const onSignInAnonymously = async () => {
  try {
    isLoading.value = true
    form.error = ''

    const newUser = await signInAnonymously(auth)
    await createNewDbUser(newUser)

    router.push(redirectTo.value)
  } catch (error) {
    form.error = 'There was an error signing you in. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const onSignInOrSignUp = async () => {
  if (!form.isValid) return

  try {
    isLoading.value = true
    form.error = ''

    if (isSigningUp.value) {
      const newUser = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await createNewDbUser(newUser)
    } else {
      await signInWithEmailAndPassword(auth, form.email, form.password)
    }

    router.push(redirectTo.value)
  } catch (error) {
    if (isSigningUp.value) {
      form.error = 'There was an error creating your account. Please try again.'
    } else {
      form.error = 'There was an error signing you in. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const toggleSignUp = async (value: boolean) => {
  isSigningUp.value = value
  form.error = ''

  await nextTick()

  if (isSigningUp.value) {
    formSectionElem.value?.scrollIntoView?.(false)
  } else {
    formSectionElem.value?.scrollIntoView?.(true)
  }
}
</script>
