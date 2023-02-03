import {Tool} from 'sanity'
import {RocketIcon} from '@sanity/icons'

import RoutedTool from '../components/RoutedTool'
import {UNIQUE_TYPES} from '../constants'
import { route } from 'sanity/router'

export type RoutedToolOptions = {
  types?: string[]
}

export type RoutedToolConfig = Tool<RoutedToolOptions>

// Tools can have predefined `options` which the `component` can use
// This way custom Tools are composable and can be reused in different contexts
export const routedTool: RoutedToolConfig = {
  title: 'Routed Tool',
  name: 'routed-tool',
  icon: RocketIcon,
  component: RoutedTool,
  options: {
    types: UNIQUE_TYPES,
  },
  // Optional: Create additional routing options within the Tool
  // Only necessary if you want to use the `router` to navigate in your Tool
  // `/` here is the root of this tool
  // Example: /routed-tool
  router: route.create('/', [
    // This creates a wildcard inside the tool
    // Example: /routed-tool/flying
    route.create({
      path: '/:type',
    })
  ])
}
