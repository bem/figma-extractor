import { writeFile } from 'fs-extra'
import { resolve } from 'path'
import fetch, { Headers } from 'node-fetch'
import qs from 'query-string'

import { FigmaChildren, parseComponents, Component } from './parse-components'
import { optimizeSvg } from './optimize-svg'
import { convertSvgToJsx, TemplateFn } from './svg-to-jsx'
import { format } from './formatter'

export interface ExtractConfig {
  token: string
  file: string
  page: string
  filter?: 'svg' | 'tsx' | 'svg+tsx'
  preserveColors?: boolean
  templateFn?: TemplateFn
}

export async function extractSvgFromFigma(resultDir: string, config: ExtractConfig) {
  console.log('❯ Fetch components from figma')

  const components = await fetchSvgComponents(config)
  const urls = await fetchSvgUrl(Array.from(components.keys()), config)

  let filter = config.filter || 'svg+tsx'

  for (const [id, url] of urls) {
    const component = components.get(id)!

    const source = await fetchSvgSource(url, config)

    let filteredTasks = []

    if (filter.includes('tsx')) {
      const jsx = convertSvgToJsx(source, component, config.templateFn)
      filteredTasks.push(writeSvgFile(`${component.name}.tsx`, jsx, resultDir))
    }
    if (filter.includes('svg')) {
      filteredTasks.push(writeSvgFile(`${component.name}.svg`, source, resultDir))
    }

    await Promise.all(filteredTasks)

    console.log('❯ Component fetched and created:', `${component.name}`)
  }

  if (filter.includes('tsx')) {
    writeIndexFile(components, resultDir)
  }

  console.log('❯ Index created')
}

export async function fetchSvgComponents(config: ExtractConfig) {
  interface OkResponse {
    document: {
      id: string
      children: FigmaChildren[]
    }
  }
  const { token, file, page: pageId } = config
  const headers = new Headers({
    'X-Figma-Token': token,
  })

  const response = await fetch(encodeURI(`https://api.figma.com/v1/files/${file}?ids=${pageId}`), {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error(`Unexpected response: ${response.statusText}.`)
  }

  const json: OkResponse = await response.json()
  const page = json.document.children.find((child) => child.id === pageId)

  if (!page) {
    throw new Error(`Cannot find page: ${document}.`)
  }
  return parseComponents(page)
}

async function fetchSvgUrl(ids: string[], config: ExtractConfig) {
  const { token, file } = config
  const headers = new Headers({
    'X-Figma-Token': token,
  })
  const query = qs.stringify({ ids, format: 'svg' }, { arrayFormat: 'comma' })
  const response = await fetch(`https://api.figma.com/v1/images/${file}?${query}`, {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    throw new Error(`Unexpected response: ${response.statusText}.`)
  }

  interface OkResponse {
    err?: any
    images: Record<string, string>
  }

  const json: OkResponse = await response.json()

  if (json.err) {
    throw new Error(json.err)
  }

  const images = new Map(Object.entries(json.images))

  return images
}

async function fetchSvgSource(resultDir: string, config: ExtractConfig) {
  const response = await fetch(resultDir, { method: 'GET' })

  if (!response.ok) {
    throw new Error(`Unexpected response: ${response.statusText}`)
  }

  let content = await response.text()
  content = optimizeSvg(content, config)

  return content
}

async function writeSvgFile(name: string, content: string, resultDir: string) {
  writeFile(resolve(resultDir, name), content)
}

async function writeIndexFile(components: Map<string, Component>, resultDir: string) {
  const exports = []

  for (const [_, component] of components) {
    exports.push(`export * from './${component.name}'`)
  }

  const content = format(exports.join('\n'))

  await writeFile(resolve(resultDir, 'index.ts'), content)
}
