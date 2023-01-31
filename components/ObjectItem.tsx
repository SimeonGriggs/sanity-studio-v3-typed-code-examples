import React from 'react'
import {KeyedObject, ObjectItemProps} from 'sanity'
import {Card, Stack, Code} from '@sanity/ui'

// This sets the type of the `value` prop inside the component
// All keys must be optional, since the object may be empty
// Other than _key which is expected, because "Item"'s are rendered in an array
type ObjectValue = KeyedObject & {
  _type?: string
  x?: number
  y?: number
}

// A custom 'item' component replaces the built-in component for items in an array
// Add to your schema like this:
// components: { item: ObjectItem }
export default function ObjectItem(props: ObjectItemProps<ObjectValue>) {
  // The `onChange` handler is inside `inputProps`
  // See ObjectInput for an example of how to use onChange
  // const {onChange} = props.inputProps

  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectItem</Code>
        {props.renderDefault(props)}
      </Stack>
    </Card>
  )
}
