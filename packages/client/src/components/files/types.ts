import type { Attachment } from '@emcord/types'

export type LoadingFile = Attachment & {
  status?: 'pending' | 'uploading' | 'done' | 'error'
  progress?: number
}
