import React from 'react'
import {ObjectItemProps} from 'sanity'
import {Card, Stack, Code} from '@sanity/ui'

type ObjectValue = {
  _key: string
  _type?: string
  x?: number
  y?: number
}

export default function ObjectItem(props: ObjectItemProps<ObjectValue>) {
// console.log(props)
  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectItem</Code>
        {props.renderDefault(props)}
      </Stack>
    </Card>
  )
}
