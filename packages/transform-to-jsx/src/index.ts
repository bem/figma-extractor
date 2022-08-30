import type { Node } from '@figma-extractor/core'

import { parse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

import { WithJsx, Plugin } from './types'
import { jsxTransformPlugin } from './jsxTransformPlugin'

export const transformToJsx = <N extends Node>(node: N, plugins: Plugin[] = []): WithJsx<N> => {
  const ast = parse(node.content, { plugins: ['jsx'] })

  const extendedPlugins = [jsxTransformPlugin, ...plugins]
  extendedPlugins.forEach((plugin) => traverse(ast, plugin.traverseOptions(node, t)))

  const result = transformFromAstSync(ast, node.content)

  return {
    ...node,
    jsxContent: result?.code?.replace(/;$/, '') ?? '',
  }
}

export * from './svgAttributesPlugin'
export * from './types'
