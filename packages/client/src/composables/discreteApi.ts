import type { DialogOptions } from 'naive-ui'
import {
  createDiscreteApi,
  darkTheme,
} from 'naive-ui'
import type { VNode } from 'vue'

const {
  message,
  dialog,
  notification,
  loadingBar,
} = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'], {
  configProviderProps: {
    theme: darkTheme,
  },
  messageProviderProps: {
    placement: 'bottom-right',
  },
  notificationProviderProps: {
    placement: 'bottom-right',
    max: 1,
  },
})

function openDialog(content: string | (() => VNode), options: DialogOptions = {}) {
  dialog.create({
    content,
    closable: false,
    showIcon: false,
    style: { padding: '0px', borderRadius: '10px' },
    transformOrigin: 'center',

    ...options,
  })
}

export {
  message,
  dialog,
  notification,
  loadingBar,
  openDialog,
}
