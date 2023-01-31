import React from 'react'
import {ObjectInputProps} from 'sanity'
import {Card, Stack, Code} from '@sanity/ui'

type ObjectValue = {
  _type: string
  x?: number
  y?: number
}

export default function ObjectInput(props: ObjectInputProps<ObjectValue>) {
  console.log(props)
  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectInput</Code>
        {props.renderDefault(props)}
      </Stack>
    </Card>
  )
}
