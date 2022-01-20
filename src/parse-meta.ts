export interface Meta {
  isExported: boolean
  modifiers: string[]
  sizes: number[]
}

/**
 * @example
 * parseMeta('Filled=True, Outline=False, 24=True, 16=False'): {
 *   size: 24,
 *   isOutline: false,
 * }
 */
export function parseMeta(meta: string): Meta {
  const result: Meta = { isExported: true, sizes: [0], modifiers: [] }
  const chunks = meta.replace(/\s/g, '').split(',')

  for (const chunk of chunks) {
    const [token, value] = chunk.split('=')

    switch (token) {
      case 'Export':
        result.isExported = value === 'False' ? false : true
        break
      case 'Size':
        result.sizes = [Number.parseInt(value)]
        break
      default:
        if (token.match(/^\d+$/)) {
          result.sizes = value && value.toLowerCase() === 'true' ? [Number(token)] : result.sizes
        } else if (value && value.toLowerCase() === 'true') {
          result.modifiers.push(token)
        }
        break
    }
  }

  // For a consistency
  result.modifiers = result.modifiers.sort()

  return result
}
