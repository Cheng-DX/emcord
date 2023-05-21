export function useActiveTabs() {
  const activeTabs = useLocalStorage<Record<string, string>>('activeTabs', {}, {
    mergeDefaults: true,
  })

  function setActiveTab(serverId: string, tab: string) {
    activeTabs.value[serverId] = tab
  }

  return {
    activeTabs,
    setActiveTab,
  }
}
