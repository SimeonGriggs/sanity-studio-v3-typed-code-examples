import {InputProps, defineConfig, isObjectInputProps} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {Stack} from '@sanity/ui'

import {schemaTypes} from './schema'
import {routedToolPlugin} from './plugins/routedTool'
import {structure} from './desk/structure'
import {Progress} from './schema/progress/Progress'
// import {Progress} from './schema/progress/ProgressDummy'
import Padding from './components/Padding'

export default defineConfig({
  name: 'default',
  title: 'Sanity Studio v3 Typed Examples',

  projectId: '2hg4vhq7',
  dataset: 'production',

  plugins: [deskTool({structure}), visionTool(), routedToolPlugin()],

  schema: {
    types: schemaTypes,
  },
  form: {
    components: {
      input: (props: InputProps) => {
        if (
          props.id === 'root' &&
          isObjectInputProps(props) &&
          props.schemaType.name === 'preflight'
        ) {
          return <Padding>{Progress(props)}</Padding>
        } else if (props.id === 'root') {
          return <Padding>{props.renderDefault(props)}</Padding>
        }

        return props.renderDefault(props)
      },
    },
  },
})
