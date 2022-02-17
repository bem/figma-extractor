#! /usr/bin/env node
const extract = require('../lib/index.js').default
const { resolve } = require('path')

const argv = require('yargs/yargs')(process.argv.slice(2)).command(
  '$0 <path> <token> <file> <page> [filter]',
  'the default command',
  {
    'preserve-colors': {
      boolean: true,
      description: 'Disables replacing colors with `currentColor`',
    },
    'non-square': {
      boolean: true,
      description: 'Didables replacing `width` and `height` with `size` parameter',
    },
  },
  (argv) => {
    const resultDir = resolve(process.cwd(), argv.path)
    const params = {
      token: argv.token,
      file: argv.file,
      page: argv.page,
      filter: argv.filter,
      preserveColors: argv['preserve-colors'],
      nonSquare: argv['non-square'],
    }
    extract(resultDir, params)
  },
).argv
