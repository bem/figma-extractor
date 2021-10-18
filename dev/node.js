const extract = require('../lib/index.js').default
const { resolve } = require('path')
require('dotenv').config()

const { FIGMA_TOKEN = '', FIGMA_FILE, FIGMA_PAGE } = process.env
const resultDir = resolve(__dirname, 'test')
const params = {
  token: FIGMA_TOKEN,
  file: FIGMA_FILE,
  page: FIGMA_PAGE,
}

extract(resultDir, params)
