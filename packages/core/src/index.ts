import { env } from 'process'
import fetch from 'node-fetch'

import { DEFAULT_CONFIG, FIGMA_BASE_URL } from './constants'
import type {
  ExtractorConfig,
  Source,
  Node,
  NodeInfo,
  FigmaFileResponse,
  FigmaImageLinksResponse,
  FigmaNode,
} from './types'

export class Extractor {
  config: ExtractorConfig

  constructor(config: Partial<ExtractorConfig>) {
    this.config = Object.assign(DEFAULT_CONFIG, config)
  }

  private async fetchFigma(url: string, token: string) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to get response from Figma API: ${response.statusText}.`)
    }
    return response
  }

  private async fetchFile(source: Source, token: string): Promise<FigmaFileResponse> {
    const apiUrl = new URL(`/v1/files/${source.fileId}/nodes`, FIGMA_BASE_URL)
    apiUrl.searchParams.append(
      'ids',
      Array.isArray(source.nodeId) ? source.nodeId.join(',') : source.nodeId,
    )

    const response = await this.fetchFigma(apiUrl.toString(), token)

    return (await response.json()) as FigmaFileResponse
  }

  private async fetchImageLinks(
    source: Source,
    token: string,
    nodeIds: string[],
  ): Promise<FigmaImageLinksResponse> {
    const apiUrl = new URL(`/v1/images/${source.fileId}`, FIGMA_BASE_URL)
    apiUrl.searchParams.append('ids', nodeIds.join(','))
    apiUrl.searchParams.append('format', 'svg')

    const response = await this.fetchFigma(apiUrl.toString(), token)

    return (await response.json()) as FigmaImageLinksResponse
  }

  private async fetchImage(token: string, imageLink: string): Promise<string> {
    const response = await this.fetchFigma(imageLink, token)

    return await response.text()
  }

  private mapNode(node: NodeInfo): NodeInfo {
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      parent: node.parent,
    }
  }

  private filterNodes(nodes: FigmaNode[] | undefined, parent: NodeInfo, depth = 1): NodeInfo[] {
    if (!nodes || depth > this.config.depth) {
      return []
    }

    return nodes
      .flatMap((node) => {
        const nodeWithParent = { ...node, parent }

        if (this.config.nodeFilter(nodeWithParent)) {
          return [nodeWithParent as NodeInfo]
        }

        return this.filterNodes(nodeWithParent.children, this.mapNode(parent), depth + 1)
      })
      .map(this.mapNode)
  }

  async extract(source: Source): Promise<Node[]> {
    const token = source.token || this.config.token || env.FIGMA_TOKEN
    if (!token) {
      throw Error(
        'Figma API token is missing. Either set environment variable $FIGMA_TOKEN or specify it in `ExtractorConfig`',
      )
    }

    const nodesMap = (await this.fetchFile(source, token)).nodes
    const nodes = Object.values(nodesMap)
      .map((node) => node.document)
      .flatMap((node) => this.filterNodes(node.children, this.mapNode(node)))

    if (nodes.length === 0) {
      return []
    }

    const imagesLinksMap = (
      await this.fetchImageLinks(
        source,
        token,
        nodes.map((node) => node.id),
      )
    ).images

    const nodesWithContent = []

    for (const node of nodes) {
      const content = await this.fetchImage(token, imagesLinksMap[node.id])

      nodesWithContent.push({
        ...node,
        content,
      })
    }

    return nodesWithContent
  }
}

export { Node, NodeInfo, ExtractorConfig, Source } from './types'
