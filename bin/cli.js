#! /usr/bin/env node
const extract = require('../lib/index.js').default
const { resolve } = require('path')

const argv = require('yargs/yargs')(process.argv.slice(2)).command(
  '$0 <path> <token> <file> <page> [filter]',
  'the default command',
  () => {},
  (argv) => {
    const resultDir = resolve(process.cwd(), argv.path)
    const params = {
      token: argv.token,
      file: argv.file,
      page: argv.page,
      filter: argv.filter,
    }
    extract(resultDir, params)
  },
).argv
