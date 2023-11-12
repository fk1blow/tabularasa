export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

export function pluralizeNone(count: number, singular: string, plural: string, none?: string) {
  const noneDefault = none ?? `No ${plural}`
  return count === 0 ? noneDefault : pluralize(count, singular, plural)
}
