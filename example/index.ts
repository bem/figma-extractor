import * as fs from 'fs'
import * as path from 'path'

import { Extractor } from '@figma-extractor/core'
import { svgoOptimize, defaultPlugins, currentColorPlugin } from '@figma-extractor/svgo-optimize'
import { parseComponentProperties } from '@figma-extractor/parse-properties'
import {
  transformToJsx,
  svgAttributes,
  Plugin as JsxPlugin,
} from '@figma-extractor/transform-to-jsx'
import { pascalCase, snakeCase } from 'change-case'

// Clone of Micorsoft's Fluent emojis
// https://www.figma.com/file/wRtfYH2sNvqSyKYsyHYYHh/Fluent-emoji-%E2%80%94-3-(Community)
const FILE_ID = 'wRtfYH2sNvqSyKYsyHYYHh'
const FOOD_PAGE_ID = '12:33'

const ICONS_FOLDER = path.join(__dirname, '../icons')

const extractor = new Extractor({
  depth: 2,
  nodeFilter(node) {
    return (
      node.type === 'COMPONENT' &&
      (node.name === 'Theme=High Contrast' || node.name === 'Theme=Flat')
    )
  },
})

const svgoPlugins = [...defaultPlugins, currentColorPlugin]

const jsxPlugins: JsxPlugin[] = [
  svgAttributes((_node) => ({
    focusable: false,
    'aria-hidden': true,
  })),
]

const syncIcons = async () => {
  const nodes = await extractor.extract({
    fileId: FILE_ID,
    nodeId: FOOD_PAGE_ID,
  })

  if (!fs.existsSync(ICONS_FOLDER)) {
    fs.mkdirSync(ICONS_FOLDER)
  }

  nodes
    .map(parseComponentProperties)
    .map((node) => svgoOptimize(node, svgoPlugins))
    .map((node) => transformToJsx(node, jsxPlugins))
    .forEach((node) => {
      const reactName = `${pascalCase(node.parent!.name)}${node.properties['Theme']}Icon`
      const reactContent = `
import React from 'react'

export const ${reactName} = () => {
  return (
    ${node.jsxContent}
  )
}
      `

      fs.writeFileSync(path.join(ICONS_FOLDER, `${reactName}.jsx`), reactContent)
      fs.writeFileSync(
        path.join(ICONS_FOLDER, `${snakeCase(node.parent!.name + node.properties['Theme'])}.svg`),
        node.content,
      )
    })
}

syncIcons()
