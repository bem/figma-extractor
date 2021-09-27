import { removeSync } from 'fs-extra'
import { resolve } from 'path'
import fg from 'fast-glob'
import { extractSvgFromFigma, ExtractConfig } from './extract-svg-from-figma'

async function main(path: string, config: ExtractConfig) {
  prepareDirectory(path)
  await extractSvgFromFigma(path, config)
}

function prepareDirectory(path: string) {
  console.log('❯ Clearing ', path)
  const cwd = process.cwd()
  const ignore = [`${path}/__tests__`, `${path}/__examples__`]
  const files = fg.sync(`${path}/**/*`, { ignore, cwd })

  for (const file of files) {
    removeSync(resolve(cwd, file))
  }
}

export default main
