export interface RegistryItemManifest {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: Array<{
    path: string
    type: string
    target?: string
    content?: string
  }>
  categories?: string[]
  meta?: Record<string, unknown>
}
