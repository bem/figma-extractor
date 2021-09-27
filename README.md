# figma-icon-extractor ( WIP )

A tool for extract icons from figma in jsx and svg.

## Usage

```typescript
import extract from '@yandex/figma-icon-extractor'
import { resolve } from 'path'

extract(resolve(__dirname, 'test'), { FIGMA_TOKEN , FIGMA_PROJECT, FIGMA_DOCUMENT })
```

* **FIGMA_TOKEN** — Figma development token
* **FIGMA_PROJECT** — Project id in figma
* **FIGMA_DOCUMENT** — Document id in figma

```sh
ts-node ./tools/figma-extractor/index.ts
```

## How it work

1. Fetch components id from figma document
1. Fetch svg url for each component
1. Fetch svg source for each component
1. Optimize svg by svgo
1. Convert svg to jsx
1. Write jsx and svg to fs
1. Write index with all exports
