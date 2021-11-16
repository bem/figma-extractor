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
  },
  (argv) => {
    const resultDir = resolve(process.cwd(), argv.path)
    const params = {
      token: argv.token,
      file: argv.file,
      page: argv.page,
      filter: argv.filter,
      preserveColors: argv['preserve-colors'],
    }
    extract(resultDir, params)
  },
).argv
