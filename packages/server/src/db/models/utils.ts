export function required<T>(type: T) {
  return {
    type,
    required: true,
  }
}
