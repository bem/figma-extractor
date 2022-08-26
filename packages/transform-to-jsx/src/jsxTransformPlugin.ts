import { camelCase } from 'change-case'

import type { Plugin } from './types'

export const jsxTransformPlugin: Plugin = {
  traverseOptions(_node, t) {
    return {
      JSXOpeningElement: (path) => {
        if (!t.isJSXIdentifier(path.node.name)) {
          return
        }

        if (path.node.name.name === 'svg') {
          path.node.attributes = path.node.attributes.filter((attr) => {
            return t.isJSXAttribute(attr) && attr.name.name !== 'xmlns'
          })
        }

        path.node.attributes = path.node.attributes.map((attr) => {
          if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
            // Don't convert aria and data attributes.
            if (!attr.name.name.match(/aria|data/)) {
              attr.name.name = camelCase(attr.name.name)
            }
          }

          return attr
        })
      },
    }
  },
}
