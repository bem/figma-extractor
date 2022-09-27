# @figma-extractor/svgo-omptimize

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
