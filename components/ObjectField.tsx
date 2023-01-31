import React from 'react'
import {ObjectFieldProps} from 'sanity'
import {Card, Stack, Code} from '@sanity/ui'

// This sets the type of the `value` prop inside the component
// All keys must be optional, since the object may be empty
type ObjectValue = {
  _type?: 'coordinate'
  x?: number
  y?: number
}

// A custom 'field' component replaces the entire built-in component
// Add to your schema like this:
// components: { field: ObjectInput }
export default function ObjectField(props: ObjectFieldProps<ObjectValue>) {
  // The `onChange` handler is inside `inputProps`
  // See ObjectInput for an example of how to use onChange
  // const {onChange} = props.inputProps

  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectField</Code>
        {props.renderDefault(props)}
      </Stack>
    </Card>
  )
}
