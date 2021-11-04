import { createName } from './create-name'
import { Meta, parseMeta } from './parse-meta'

export interface Component {
  name: string
  meta: Meta
}

export interface FigmaChildren {
  id: string
  name: string
  type: 'COMPONENT_SET' | 'COMPONENT' | 'INSTANCE'
  children: FigmaChildren[]
}

export const parseComponents = (page: FigmaChildren) => {
  const components = new Map<string, Component>()
  const visited = new Map<string, { count: number; sizes: number[]; id: string }>()

  for (const firstLevelChild of page.children) {
    if (firstLevelChild.type === 'COMPONENT_SET') {
      const setMeta = parseMeta(firstLevelChild.name)
      if (!setMeta.isExported) {
        continue
      }

      for (const secondLevelChild of firstLevelChild.children) {
        if (secondLevelChild.type === 'COMPONENT') {
          parseComponent(secondLevelChild, firstLevelChild.name, { visited, components })
        }
      }
    }
    if (firstLevelChild.type === 'COMPONENT' || firstLevelChild.type === 'INSTANCE') {
      parseComponent(firstLevelChild, undefined, { visited, components })
    }
  }

  return components
}

function parseComponent(
  component: FigmaChildren,
  parentName: string | undefined,
  closure: {
    visited: Map<string, { count: number; sizes: number[]; id: string }>
    components: Map<string, Component>
  },
) {
  const { visited, components } = closure
  const componentMeta = parseMeta(component.name)

  if (!componentMeta.isExported) {
    return
  }

  const name = createName(parentName || component.name.split(',')[0], componentMeta.isOutline)
  const previous = visited.get(name)

  if (previous) {
    if (Math.max(...previous.sizes) < componentMeta.sizes[0]) {
      components.forEach((component, componentKey) => {
        if (component.name === name) {
          components.delete(componentKey)
        }
      })

      const sizes = [...previous.sizes, ...componentMeta.sizes]
      components.set(component.id, {
        meta: { ...componentMeta, sizes: sizes },
        name,
      })
      visited.set(name, {
        id: previous.id,
        count: ++previous.count,
        sizes,
      })
    } else if (!previous.sizes.includes(componentMeta.sizes[0])) {
      const sizes = [...componentMeta.sizes, ...previous.sizes]
      components.set(previous.id, {
        meta: { ...components.get(previous.id)!.meta, sizes: sizes },
        name,
      })

      visited.set(name, {
        id: previous.id,
        count: ++previous.count,
        sizes,
      })
    } else {
      console.log(`⚠️ Found name collision: ${name} ${componentMeta.sizes[0]}`)

      visited.set(name, {
        ...previous,
        count: ++previous.count,
      })
    }
  } else {
    components.set(component.id, { meta: componentMeta, name })
    visited.set(name, { count: 0, sizes: componentMeta.sizes, id: component.id })
  }
}
