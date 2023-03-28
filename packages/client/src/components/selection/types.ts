export interface Option {
  label: string
  value: string
  onClick: () => void
  icon: string
  type?: 'primary' | 'success' | 'danger'
  color?: string
}
