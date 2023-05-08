import type { Ref } from 'vue'

export function useStatus<R extends string, T extends R[]>(
  options: T,
  initValue: T[number],
) {
  const status = ref(initValue) as Ref<T[number]>

  const r = {}

  return {
    status,
    set: (s: T[number]) => status.value = s,
    ...r,
  }
}
