import { createGlobalState } from '@vueuse/core'
import { computed, ref } from 'vue'

export const useErrorSnackbar = createGlobalState(() => {
  const message = ref<string | null>(null)

  const showSnackbar = computed<boolean>({
    get() {
      return message.value !== null
    },
    set(value) {
      if (!value) message.value = null
    }
  })

  return {
    message,
    showSnackbar
  }
})
