import type { Node } from '@figma-extractor/core'

import { optimize, Plugin } from 'svgo'

export const svgoOptimize = <N extends Node>(node: N, plugins: Plugin[] = defaultPlugins): N => {
  const optimizedContent = optimize(node.content, { plugins })
  if (optimizedContent.error !== undefined) {
    throw new Error(`Failed to optimize svg: ${optimizedContent.error}`)
  }

  return {
    ...node,
    content: optimizedContent.data,
  }
}

export const defaultPlugins: Plugin[] = [
  'preset-default',
  {
    name: 'removeViewBox',
    active: false,
  },
]

export type { Plugin } from 'svgo'
