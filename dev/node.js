const extract = require('../lib/index.js').default
const { resolve } = require('path')
require('dotenv').config()

const { FIGMA_TOKEN = '', FIGMA_PROJECT, FIGMA_DOCUMENT } = process.env

extract(resolve(__dirname, 'test'), { FIGMA_TOKEN, FIGMA_PROJECT, FIGMA_DOCUMENT })
