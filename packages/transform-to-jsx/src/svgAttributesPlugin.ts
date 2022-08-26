import type { Node } from '@figma-extractor/core'

import { JSXExpressionContainer } from '@babel/types'
import type { BabelTypes, Plugin } from './types'

type AttributesMap = Record<string, string | number | boolean | JSXExpressionContainer>
type AttributesFn = (node: Node, t: BabelTypes) => AttributesMap

export const svgAttributes = (fn: AttributesFn): Plugin => {
  return {
    traverseOptions(node, t) {
      const attributes = fn(node, t)

      return {
        JSXOpeningElement: (path) => {
          if (!t.isJSXIdentifier(path.node.name) || path.node.name.name !== 'svg') {
            return
          }

          for (const [name, value] of Object.entries(attributes)) {
            if (typeof value === 'object' && value.type === 'JSXExpressionContainer') {
              path.node.attributes.push(t.jsxAttribute(t.jsxIdentifier(name), value))
            } else {
              path.node.attributes.push(
                t.jsxAttribute(t.jsxIdentifier(name), t.stringLiteral(value.toString())),
              )
            }
          }
        },
      }
    },
  }
}
