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

## `@figma-extractor/core`

Provides basic functionality of traversing nodes and downloading it's content. Peer dependency for other packages

### Methods

- `new Extractor(config: ExtractorConfig)`: Construct new instance of extractor
- `async Extractor.extract(source: Source): Node[]`: Traverse source children and fetches filtered nodes

### Types

- [`ExtractorConfig`](packages/core/src/types.ts#L12)
- [`Source`](packages/core/src/types.ts#L36)
- [`Node`](packages/core/src/types.ts#L8)


## `@figma-extractor/parse-properties`

Small helper for parsing [Figma component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Create-and-use-component-properties)

```ts
import { parseComponentProperties } from '@figma-extractor/parse-properties'

nodes
    .map(parseComponentProperties)
    .forEach(node => {
        // node.properties['Name']
    })
```

## `@figma-extractor/svgo-omptimize`

Wrapper around `svgo`

```ts
import { svgoOptimize } from '@figma-extractor/svgo-optimize'

nodes
    .map((node) => svgoOptimize(node))
    .forEach((node) => {
        // node.content overwritten with result of optimization
    })
```

### Exports

- `svgoOptimize(node: Node, plugins: svgo.Plugin[] = defaultPlugins)`
- `defaultPlugins`: modification of `preset-default` with `removeViewBox` turned off
- `currentColorPlugin`: replaces `fill` and `stroke` with `currentColor`. Useful for inlined single-colored icons 

## `@figma-extractor/transform-to-jsx`

Parses svg with babel and prepare for using inside JSX components. (See example above) – renames attributes to camelCase, removes extra attributes etc. Allows to customize behaviour using Plugins api

```ts
import { transformToJsx } from '@figma-extractor/transform-to-jsx'

nodes
    .map((node) => transformToJsx(node))
    .forEach((node) => {
        // node.jsxContent
    })
```

### Exports

- `transformToJsx(node: Node, extraPlugins: Plugin[] = [])`
- `svgAttributes(fn: AttributesFn)`: Plugin for adding extra attributes to svg's root element

### Types

- [`Plugin`](packages/transform-to-jsx/src/types.ts#11)
- [`AttributesFn`](packages/transform-to-jsx/src/svgAttributesPlugin.ts#L7)

# Writing your own package

[`@figma-extractor/parse-properties`](packages/parse-properties/) is a good example for a fresh start. Actually there are no restrictions of how your package should be organized, but mentioned aproach highly increases reusability