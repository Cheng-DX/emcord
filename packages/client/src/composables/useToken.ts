export function useToken() {
  const token = useLocalStorage<string>('token', '', {
    mergeDefaults: true,
  })
  const hasToken = computed(() => !!token.value)
  const setToken = (newVal: string) => {
    token.value = newVal
  }
  const clearToken = () => setToken('')

  return {
    token,
    hasToken,
    setToken,
    clearToken,
  }
}
