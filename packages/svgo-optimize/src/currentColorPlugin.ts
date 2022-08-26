import type { Plugin } from 'svgo'

export const currentColorPlugin: Plugin = {
  name: 'current-color',
  type: 'perItem',
  fn: (ast) => {
    if (ast.name === 'path' && ast.attributes.fill !== undefined) {
      ast.attributes.fill = 'currentColor'
    }

    if (ast.name === 'path' && ast.attributes.stroke !== undefined) {
      ast.attributes.stroke = 'currentColor'
    }
  },
}
