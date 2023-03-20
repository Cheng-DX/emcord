import { createFetch } from '@vueuse/core'
import { useToken } from './useToken'
import { message } from './discreteApi'
import { router } from '~/router'

const { token, hasToken } = useToken()

export const useFetch = createFetch({
  options: {
    async beforeFetch({ options }) {
      if (hasToken.value)
        (options.headers as any).Authorization = `Bearer ${token.value}`
      else
        router.push('/login')

      return { options }
    },
    onFetchError(ctx) {
      const { response, data } = ctx
      if (response?.status === 488)
        message.warning(`from 488: ${data?.message}`)

      return ctx
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
