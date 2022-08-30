import { ExtractorConfig } from './types'

export const FIGMA_BASE_URL = 'https://api.figma.com/'

export const DEFAULT_CONFIG: ExtractorConfig = {
  depth: 2,
  nodeFilter: (node) => node.type == 'COMPONENT' || node.type == 'COMPONENT_INSTANCE',
  token: undefined,
}
