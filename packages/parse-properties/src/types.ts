export type WithProperties<N> = N & {
  properties: Record<string, string | number | boolean>
}
