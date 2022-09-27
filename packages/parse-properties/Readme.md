# @figma-extractor/parse-properties

Small helper for parsing [Figma component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Create-and-use-component-properties)

```ts
import { parseComponentProperties } from '@figma-extractor/parse-properties'

nodes
    .map(parseComponentProperties)
    .forEach(node => {
        // node.properties['Name']
    })
```
