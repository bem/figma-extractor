# figma-icon-extractor ( WIP )

A tool for extract icons from figma in jsx and svg.

## Usage

```typescript
import extract from '@yandex/figma-icon-extractor'
import { resolve } from 'path'

const { FIGMA_TOKEN = '', FIGMA_FILE = '', FIGMA_PAGE = '' } = process.env
const resultDir = resolve(__dirname, 'test')
const params = {
  token: FIGMA_TOKEN,
  file: FIGMA_FILE,
  page: FIGMA_PAGE,
}

extract(resultDir, params)
```
or via npx
```sh
npx @yandex/figma-icon-extractor <resultDir> <token> <file> <page> [filter]
```
* **token** — Figma development token
* **file** — File id in figma
* **page** — Page id in figma
* **filter** - Optional. Which files should be generated either `svg` or `tsx` or `svg+tsx`
* **--preserve-color** - Optional. Disables replacing colors with `currentColor` 

Hint: You can retrieve file and page ids from url `https://www.figma.com/file/<file id>/<file name>?node-id=<page id>`

## How it work

1. Fetch components id from figma document
1. Fetch svg url for each component
1. Fetch svg source for each component
1. Optimize svg by svgo
1. Convert svg to jsx
1. Write jsx and svg to fs
1. Write index with all exports
