import { camelCase } from 'change-case'
import { parse } from '@babel/parser'
import { transformFromAstSync } from '@babel/core'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

import { format } from './formatter'
import { Component } from './parse-components'
import { ExtractConfig } from './extract-svg-from-figma'

export type ComponentTemplateFn = (props: { svg: string; name: string; sizes: number[] }) => string

export function convertSvgToJsx(svg: string, component: Component, config: ExtractConfig) {
  const ast = parse(svg, { plugins: ['jsx'] })
  const template =
    config.componentTemplateFn ||
    (config.nonSquare ? defaultNonSquareComponentTemplate : defaultSquareComponentTemplate)

  prepareSvgJsxAst(ast, config)

  const result = transformFromAstSync(ast, svg)
  const content = template({
    name: component.selfName,
    svg: normalizeResultCode(result?.code ?? ''),
    sizes: component.meta.sizes,
  })

  return format(content)
}

function prepareSvgJsxAst(ast: any, config: ExtractConfig) {
  traverse(ast, {
    JSXOpeningElement: (path) => {
      if (!t.isJSXIdentifier(path.node.name)) {
        return
      }

      if (path.node.name.name === 'svg') {
        path.node.attributes = path.node.attributes.filter((attr) => {
          return t.isJSXAttribute(attr) && attr.name.name !== 'xmlns'
        })

        if (!config.nonSquare) {
          path.node.attributes = path.node.attributes.map((attr) => {
            if (t.isJSXAttribute(attr)) {
              if (attr.name.name === 'width' || attr.name.name === 'height') {
                attr.value = t.jsxExpressionContainer(t.identifier('size'))
              }
            }

            return attr
          })
        }

        path.node.attributes.push(
          t.jsxSpreadAttribute(t.identifier('otherProps')),
          t.jsxAttribute(t.jsxIdentifier('focusable'), t.stringLiteral('false')),
          t.jsxAttribute(t.jsxIdentifier('aria-hidden'), t.stringLiteral('true')),
          t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.jsxExpressionContainer(
              t.binaryExpression(
                '+',
                t.stringLiteral('SvgIcon'),
                t.conditionalExpression(
                  t.identifier('className'),
                  t.binaryExpression('+', t.stringLiteral(' '), t.identifier('className')),
                  t.stringLiteral(''),
                ),
              ),
            ),
          ),
          t.jsxAttribute(t.jsxIdentifier('ref'), t.jsxExpressionContainer(t.identifier('ref'))),
        )
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
  })
}

function normalizeResultCode(code: string) {
  return code.replace(/;$/, '')
}

function defaultSquareComponentTemplate(props: { svg: string; name: string; sizes: number[] }) {
  const { svg, name } = props

  const template = `
    /* This file was created automatically, don't change it manually. */

    import React, { SVGAttributes, forwardRef } from 'react'

    export interface ${name}Props extends SVGAttributes<SVGSVGElement> {
      /**
       * Additional className for svg root
       */
      className?: string
      /**
       * Icon size
       *
       * @default ${props.sizes[0]}
       */
      size?: ${props.sizes.join(' | ')}
    }

    export const ${name} = forwardRef<SVGSVGElement, ${name}Props>((props, ref) => {
      const { className, size = ${props.sizes[0]}, ...otherProps } = props

      return (
        ${svg}
      )
    })
  `

  return template
}

function defaultNonSquareComponentTemplate(props: { svg: string; name: string; sizes: number[] }) {
  const { svg, name } = props

  const template = `
    /* This file was created automatically, don't change it manually. */

    import React, { SVGAttributes, forwardRef } from 'react'

    export interface ${name}Props extends SVGAttributes<SVGSVGElement> {
      /**
       * Additional className for svg root
       */
      className?: string
    }

    export const ${name} = forwardRef<SVGSVGElement, ${name}Props>((props, ref) => {
      const { className, ...otherProps } = props

      return (
        ${svg}
      )
    })
  `

  return template
}
