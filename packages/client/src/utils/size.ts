export function normalizeSize(bytes?: number) {
  if (!bytes)
    return '0B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / 1024 ** i)}${sizes[i]}`
}
