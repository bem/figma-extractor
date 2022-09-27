# @figma-extractor

A set of packages for working with Figma frames

```ts
import * as fs from 'fs'
import * as path from 'path'

import { Extractor } from '@figma-extractor/core'
import { svgoOptimize } from '@figma-extractor/svgo-optimize'

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
    .map((node) => svgoOptimize(node))
    .forEach((node) => {
        fs.writeFileSync(path.join(ICONS_FOLDER, `${node.parent!.name}.svg`), node.content)
    })
```

# Example

To run example, clone the repo and install deps. Then set environment variable `$FIGMA_TOKEN` and finally execute `npm run example`

Or you can view source code [here](example/index.ts)

# Packages

## [@figma-extractor/core](packages/core/)

Provides basic functionality of traversing nodes and downloading it's content

## [@figma-extractor/parse-properties](packages/parse-properties/)

Small helper for parsing [Figma component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Create-and-use-component-properties)

## [@figma-extractor/svgo-omptimize](packages/svgo-optimize/)

Wrapper around `svgo`

## [@figma-extractor/transform-to-jsx](packages/transform-to-jsx/)

Parses svg with babel and prepare for using inside JSX components

# Writing your own package

[`@figma-extractor/parse-properties`](packages/parse-properties/) is a good example for a fresh start. Actually there are no restrictions of how your package should be organized, but mentioned aproach highly increases reusability
