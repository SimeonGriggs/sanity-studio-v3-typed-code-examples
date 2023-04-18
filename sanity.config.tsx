import {InputProps, defineConfig, isObjectInputProps} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {Stack} from '@sanity/ui'

import {schemaTypes} from './schemas'
import {routedToolPlugin} from './plugins/routedTool'
import {structure} from './desk/structure'
import Progress from './schemas/progress/Progress'
import ProgressDummy from './schemas/progress/ProgressDummy'

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
          return (
            <Stack space={4}>
              <Progress members={props.members} />
              {/* <ProgressDummy members={props.members} /> */}
              {props.renderDefault(props)}
            </Stack>
          )
        }

        return props.renderDefault(props)
      },
    },
  },
})
