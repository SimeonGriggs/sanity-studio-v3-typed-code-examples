import React from 'react'
import {ObjectFieldProps} from 'sanity'
import {Card, Stack, Code} from '@sanity/ui'

type ObjectValue = {
  _type: string
  x?: number
  y?: number
}

export default function ObjectField(props: ObjectFieldProps<ObjectValue>) {
  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectField</Code>
        {props.renderDefault(props)}
      </Stack>
    </Card>
  )
}
