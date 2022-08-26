import type { Node } from '@figma-extractor/core'

export interface NodeWithProperties extends Node {
  properties: Record<string, string | number | boolean>
}
