import { createLinkedList } from './linkedList'

export function createSizedMap<K, V>(max: number) {
  const sizedMap = new Map<K, V>()
  const counterMap = new Map<K, number>()

  const { list, moveToHead } = createLinkedList<string>([])

  function set(key: K, value: V) {
  }
}
