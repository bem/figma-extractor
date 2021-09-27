#! /usr/bin/env node
const extract = require('../lib/index.js').default
const { resolve } = require('path')

const argv = require('yargs/yargs')(process.argv.slice(2)).command(
  '$0 <path> <token> <project> <document>',
  'the default command',
  () => {},
  (argv) => {
    const resultDir = resolve(process.cwd(), argv.path)
    const params = {
      token: argv.token,
      project: argv.project,
      document: argv.document,
    }
    extract(resultDir, params)
  },
).argv
