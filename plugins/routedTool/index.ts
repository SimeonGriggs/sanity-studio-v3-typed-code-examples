import {definePlugin} from 'sanity'

import {routedTool} from './tool'

// Isolating functionality like a custom Tool into a plugin
// Is a clean way to develop new functionality in isolation
// and easily share it with other Sanity projects
export const routedToolPlugin = definePlugin({
  name: 'routedToolPlugin',
  tools: (prev) => [...prev, routedTool],
})
