import { pascalCase } from 'change-case'

export function createName(baseName: string, modifiers: string[]) {
  assertName(baseName, (name) => `❗️ Found unexpected symbols in name: ${name}`)

  return pascalCase(`${baseName}${modifiers.map((s) => pascalCase(s)).join('')}`)
}

function assertName(name: string, fn: (name: string) => string) {
  if (name.match(/_|\d/)) {
    console.log(fn(name))
  }
}
