import React from 'react'
import {PreviewProps} from 'sanity'
import {Card, Stack, Code} from '@sanity/ui'

type ObjectValue = {
  _type: string
  _key: string
  x?: number
  y?: number
}

export default function ObjectPreview(props: PreviewProps<'default'>) {
  // console.log(props)
  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectPreview</Code>
        {props.renderDefault(props)}
      </Stack>
    </Card>
  )
}
