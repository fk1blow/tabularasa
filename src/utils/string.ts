export function pluralize(
  toCount: unknown[] | string | number,
  singular: string,
  plural: string
) {
  const count =
    Array.isArray(toCount) || typeof toCount === 'string'
      ? toCount.length
      : toCount
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`
}

export function nthize(num: number) {
  const j = num % 10
  const k = num % 100
  if (j === 1 && k !== 11) {
    return `${num}st`
  }
  if (j === 2 && k !== 12) {
    return `${num}nd`
  }
  if (j === 3 && k !== 13) {
    return `${num}rd`
  }
  return `${num}th`
}
