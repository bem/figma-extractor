import { removeSync, mkdirSync, existsSync } from 'fs-extra'
import { resolve } from 'path'
import fg from 'fast-glob'
import { extractSvgFromFigma, ExtractConfig } from './extract-svg-from-figma'

async function main(resultDir: string, config: ExtractConfig) {
  prepareDirectory(resultDir)
  await extractSvgFromFigma(resultDir, config)
}

function prepareDirectory(resultDir: string) {
  if (existsSync(resultDir)) {
    console.log('❯ Clearing ', resultDir)
    const cwd = process.cwd()
    const ignore = [`${resultDir}/__tests__`, `${resultDir}/__examples__`]
    const files = fg.sync(`${resultDir}/**/*`, { ignore, cwd })

    for (const file of files) {
      removeSync(resolve(cwd, file))
    }
  } else {
    console.log('❯ Create ', resultDir)
    mkdirSync(resultDir)
  }
}

export default main
