import extract from '../src'
import { resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const { FIGMA_TOKEN = '', FIGMA_FILE = '', FIGMA_PAGE = '' } = process.env
const resultDir = resolve(__dirname, 'test')
const params = {
  token: FIGMA_TOKEN,
  file: FIGMA_FILE,
  page: FIGMA_PAGE,
}

extract(resultDir, params)
