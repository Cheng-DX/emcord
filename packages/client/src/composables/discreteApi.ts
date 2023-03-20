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
})

// function withDefault<A extends any[], F extends (...args: A) => any>(srcFunc: F, ...args: A): F {
//   return (...args: A) => {

//   }
// }

function openDialog(content: string | (() => VNode), options: DialogOptions) {
  dialog.create({
    content,
    closable: false,
    showIcon: false,
    style: { padding: '0' },
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
