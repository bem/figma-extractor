export interface NodeInfo {
  id: string
  name: string
  type: string
  parent?: NodeInfo
}

export interface Node extends NodeInfo {
  content: string
}

export interface ExtractorConfig {
  /**
   * Recursion depth
   *
   * @defaultValue
   * The default is `2`
   */
  depth: number
  /**
   * Figma API token used for authorizing requests
   *
   * @defaultValue
   * The default is environment variable `$FIGMA_TOKEN`
   */
  token: string | undefined
  /**
   * Decides whenever node content should be extracted
   *
   * @defaultValue
   * The default is `node.type == 'COMPONENT' || node.type == 'COMPONENT_INSTANCE'`
   */
  nodeFilter: (node: NodeInfo) => boolean
}

export interface Source {
  fileId: string
  nodeId: string | string[]
  /**
   * Allows to override Figma API token for a particular source
   */
  token?: string
}
