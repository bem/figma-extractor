import extract from '../src'
import { resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const { FIGMA_TOKEN = '', FIGMA_PROJECT = '', FIGMA_DOCUMENT = '' } = process.env

extract(resolve(__dirname, 'test'), { FIGMA_TOKEN, FIGMA_PROJECT, FIGMA_DOCUMENT })
