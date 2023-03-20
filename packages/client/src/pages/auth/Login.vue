<script setup lang="ts">
import sha256 from 'crypto-js/sha256'
import { useUserInfo } from '~/composables/useUserInfo'
import { router } from '~/router'

const email = ref('auth1')
const password = ref('auth1pw')
const { setToken } = useToken()
const { setUserInfo } = useUserInfo()

async function submit() {
  const hashedEmail = sha256(email.value).toString()
  const hashedPassword = sha256(password.value).toString()

  const { data } = await useFetch('/api/login')
    .post(
      {
        email: hashedEmail,
        password: hashedPassword,
      },
    )
    .json()

  const { token, user } = data.value
  setToken(token)
  setUserInfo(user)
  router.push('/')
}
</script>

<template>
  <div min-h-screen flex-center flex-col>
    <div>
      <input v-model="email">
    </div>
    <div>
      <input v-model="password">
    </div>
    <div btn @click="submit()">
      submit
    </div>
  </div>
</template>

<style scoped>

</style>
