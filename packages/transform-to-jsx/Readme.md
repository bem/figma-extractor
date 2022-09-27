# @figma-extractor/transform-to-jsx

Parses svg with babel and prepare for using inside JSX components (See example above) – renames attributes to camelCase, removes extra attributes etc. Allows to customize behaviour using Plugins api

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

- [`Plugin`](src/types.ts#11)
- [`AttributesFn`](src/svgAttributesPlugin.ts#L7)
