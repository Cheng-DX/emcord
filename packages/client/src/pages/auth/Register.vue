<script setup lang="ts">
import sha256 from 'crypto-js/sha256'
import { useUserInfo } from '~/composables/useUserInfo'
import { router } from '~/router'

const email = ref('auth1')
const password = ref('auth1pw')
const { setToken } = useToken()
const { setUserInfo } = useUserInfo()

async function submit() {
  const { data } = await useFetch('/api/register')
    .post(
      {
        email: email.value,
        password: password.value,
        user: {
          name: 'anam',
          hashTag: '0001',
          avator: 'https://local:000',
        },
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
    register
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
