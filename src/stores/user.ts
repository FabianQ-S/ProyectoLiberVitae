import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userName = ref<string>('')
  const isFirstTime = ref<boolean>(true)

  function setUserName(name: string) {
    userName.value = name
    isFirstTime.value = false
  }

  return {
    userName,
    isFirstTime,
    setUserName
  }
})
