export function useMenu<T>() {
  const position = ref({
    x: 0,
    y: 0,
  })
  const current = ref<T>()
  const hasCurrent = computed(() => !!current.value)
  const [visible, toggleVisible] = useToggle(false)

  function onClickItem(e: MouseEvent, item: T) {
    e.preventDefault()
    position.value.x = e.clientX
    position.value.y = e.clientY
    toggleVisible(true)
    current.value = item
  }

  return {
    position,
    current,
    hasCurrent,
    visible,
    toggleVisible,
    onClickItem,
  }
}
