import type { User, UserPreview } from '@emcord/types'

export function useUserInfo() {
  const userInfo = ref<User | null>(null)
  const ls = useLocalStorage('userInfo', '{}', {
    mergeDefaults: true,
  })
  const hasUserInfo = computed(() => {
    return userInfo.value && JSON.stringify(userInfo.value) !== '{}'
  })

  const userOverview = computed<UserPreview | null>(() => {
    if (hasUserInfo) {
      return {
        userId: userInfo.value!.id,
        avator: userInfo.value!.avator,
        name: userInfo.value!.name,
      }
    }
    else {
      return null
    }
  })
  const setUserInfo = (user: User) => {
    try {
      ls.value = JSON.stringify(user)
      userInfo.value = user
    }
    catch (e) {
      //
    }
  }

  watch(ls, () => {
    try {
      const castedUser = JSON.parse(ls.value)
      userInfo.value = castedUser
    }
    catch (e) {
      //
    }
  }, { immediate: true })

  return {
    userInfo,
    hasUserInfo,
    setUserInfo,
    userOverview,
  }
}
