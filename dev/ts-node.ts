import extract from '../src'
import { resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const { FIGMA_TOKEN = '', FIGMA_PROJECT = '', FIGMA_DOCUMENT = '' } = process.env
const resultDir = resolve(__dirname, 'test')
const params = {
  token: FIGMA_TOKEN,
  project: FIGMA_PROJECT,
  document: FIGMA_DOCUMENT,
}

extract(resultDir, params)
