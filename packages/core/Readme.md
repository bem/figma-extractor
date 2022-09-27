# @figma-extractor/core

Provides basic functionality of traversing nodes and downloading it's content. Peer dependency for other packages

```ts
import * as fs from 'fs'
import * as path from 'path'

import { Extractor } from '@figma-extractor/core'

const extractor = new Extractor({
  depth: 2,
})

const nodes = await extractor.extract({
    fileId: FILE_ID,
    nodeId: NODE_ID,
})

if (!fs.existsSync(ICONS_FOLDER)) {
    fs.mkdirSync(ICONS_FOLDER)
}

nodes
    .forEach((node) => {
        fs.writeFileSync(path.join(ICONS_FOLDER, `${node.parent!.name}.svg`), node.content)
    })
```


### Methods

- `new Extractor(config: ExtractorConfig)`: Construct new instance of extractor
- `async Extractor.extract(source: Source): Node[]`: Traverse source children and fetches filtered nodes

### Types

- [`ExtractorConfig`](src/types.ts#L12)
- [`Source`](src/types.ts#L36)
- [`Node`](src/types.ts#L8)
