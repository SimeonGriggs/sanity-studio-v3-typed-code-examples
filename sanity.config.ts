import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import { routedToolPlugin } from './plugins/routedTool'

export default defineConfig({
  name: 'default',
  title: 'Sanity Studio v3 Typed Examples',

  projectId: '2hg4vhq7',
  dataset: 'production',

  plugins: [deskTool(), visionTool(), routedToolPlugin()],

  schema: {
    types: schemaTypes,
  },
})
