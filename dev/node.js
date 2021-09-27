const extract = require('../lib/index.js').default
const { resolve } = require('path')
require('dotenv').config()

const { FIGMA_TOKEN = '', FIGMA_PROJECT, FIGMA_DOCUMENT } = process.env
const resultDir = resolve(__dirname, 'test')
const params = {
  token: FIGMA_TOKEN,
  project: FIGMA_PROJECT,
  document: FIGMA_DOCUMENT,
}

extract(resultDir, params)
