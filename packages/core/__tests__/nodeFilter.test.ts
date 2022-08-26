import { Extractor } from '../src'

// Clone of Micorsoft's Fluent emojis
// https://www.figma.com/file/wRtfYH2sNvqSyKYsyHYYHh/Fluent-emoji-%E2%80%94-3-(Community)
const FILE_ID = 'wRtfYH2sNvqSyKYsyHYYHh'
const LAPTOP_NODE_ID = '18:19425'
const KEYBOARD_NODE_ID = '18:19641'

test('should extract only 3d emojis', async () => {
  const extractor = new Extractor({
    nodeFilter(node) {
      return node.type === 'COMPONENT' && node.name === 'Theme=3D'
    },
  })

  const nodes = await extractor.extract({
    fileId: FILE_ID,
    nodeId: [LAPTOP_NODE_ID, KEYBOARD_NODE_ID],
  })

  expect(nodes).toHaveLength(2)
  nodes.forEach((node) => expect(node.content).not.toHaveLength(0))
}, 50000)
