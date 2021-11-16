import { optimize, extendDefaultPlugins, Plugin } from 'svgo'
import { ExtractConfig } from './extract-svg-from-figma'

export function optimizeSvg(svg: string, config: ExtractConfig) {
  const result = optimize(svg, { plugins: plugins(config) })

  return result.data
}

const plugins = (config: ExtractConfig) => {
  const plugins: [Plugin] = [
    {
      name: 'removeViewBox',
      active: false,
    },
  ]

  if (!config.preserveColors) {
    plugins.push({
      name: 'conver-fill',
      type: 'perItem',
      fn: (ast) => {
        if (ast.name === 'path' && ast.attributes.fill !== undefined) {
          ast.attributes.fill = 'currentColor'
        }

        if (ast.name === 'path' && ast.attributes.stroke !== undefined) {
          ast.attributes.stroke = 'currentColor'
        }
      },
    })
  }

  return extendDefaultPlugins(plugins)
}
