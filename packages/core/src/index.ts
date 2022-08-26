import { env } from 'process'
import fetch from 'node-fetch'

import type { ExtractorConfig, Source, Node, NodeInfo } from './types'

const FIGMA_BASE_URL = 'https://api.figma.com/'

interface FigmaNode {
  id: string
  name: string
  type: 'COMPONENT_SET' | 'COMPONENT' | 'INSTANCE'
  children: FigmaNode[] | undefined
}

interface FigmaFileResponse {
  nodes: Record<
    string,
    {
      document: FigmaNode
    }
  >
}

interface FigmaImageLinksResponse {
  images: Record<string, string>
}

const DEFAULT_CONFIG: ExtractorConfig = {
  depth: 2,
  nodeFilter: (node) => node.type == 'COMPONENT' || node.type == 'COMPONENT_INSTANCE',
  token: undefined,
}

export class Extractor {
  config: ExtractorConfig

  constructor(config: Partial<ExtractorConfig>) {
    this.config = Object.assign(DEFAULT_CONFIG, config)
  }

  private async fetchFile(source: Source, token: string): Promise<FigmaFileResponse> {
    const apiUrl = new URL(`/v1/files/${source.fileId}/nodes`, FIGMA_BASE_URL)
    apiUrl.searchParams.append(
      'ids',
      Array.isArray(source.nodeId) ? source.nodeId.join(',') : source.nodeId,
    )

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch document. Figma API response: ${response.statusText}.`)
    }

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

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    })
    if (!response.ok) {
      throw new Error(
        `Failed to download nodes content. Figma API response: ${response.statusText}.`,
      )
    }

    return (await response.json()) as FigmaImageLinksResponse
  }

  private async fetchImage(token: string, imageLink: string): Promise<string> {
    const response = await fetch(imageLink, {
      method: 'GET',
      headers: {
        'X-Figma-Token': token,
      },
    })
    if (!response.ok) {
      throw new Error(
        `Failed to download nodes content. Figma API response: ${response.statusText}.`,
      )
    }

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

export * from './types'
