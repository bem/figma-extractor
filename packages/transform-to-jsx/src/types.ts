import type { Node } from '@figma-extractor/core'
import { TraverseOptions } from '@babel/traverse'
import * as babelTypes from '@babel/types'

export type BabelTypes = typeof babelTypes

export interface NodeWithJsx extends Node {
  jsxContent: string
}

export interface Plugin {
  traverseOptions: (node: Node, t: BabelTypes) => TraverseOptions<babelTypes.Node>
}
