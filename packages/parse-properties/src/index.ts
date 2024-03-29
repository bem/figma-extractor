import { Node } from '@figma-extractor/core'

import { WithProperties } from './types'

export const parseComponentProperties = <N extends Node>(node: N): WithProperties<N> => {
  const properties: Record<string, string | number | boolean> = {}

  const chunks = node.name.replace(/\s/g, '').split(',')

  for (const chunk of chunks) {
    const [name, rawValue] = chunk.split('=')
    if (rawValue === undefined || rawValue.length === 0) continue

    let value = undefined
    switch (true) {
      case !Number.isNaN(Number(rawValue)): {
        value = Number(rawValue)
        break
      }
      case rawValue.toLowerCase() === 'true': {
        value = true
        break
      }
      case rawValue.toLowerCase() === 'false': {
        value = false
        break
      }
      default:
        value = rawValue
    }

    properties[name] = value
  }

  return {
    ...node,
    properties,
  }
}
