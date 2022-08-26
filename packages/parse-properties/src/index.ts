import { Node } from '@figma-extractor/core'

import { NodeWithProperties } from './types'

export const parseComponentProperties = (node: Node): NodeWithProperties => {
  const properties: Record<string, string | number | boolean> = {}

  const chunks = node.name.replace(/\s/g, '').split(',')

  for (const chunk of chunks) {
    const [name, rawValue] = chunk.split('=')
    if (rawValue === undefined || rawValue.length === 0) continue

    let value = undefined
    switch (true) {
      case Number(rawValue) !== NaN: {
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
