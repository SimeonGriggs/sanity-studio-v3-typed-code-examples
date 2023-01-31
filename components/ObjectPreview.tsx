import React from 'react'
import {PreviewProps} from 'sanity'
import {Stack, Card, Code, Flex, Box} from '@sanity/ui'

/** 
 * A "preview" component doesn't have a way to pass in a Type for the Value
 * It just inherits whatever your schema declared in its `preview` key
 * Into the `title` and `subtitle` keys
 * You could massage that data how you like in here
 * and `preview.select` in your schema can return anything
 * but TS won't be happy about it
 */

// This component is used when Objects are displayed in Arrays
export default function ObjectPreview(props: PreviewProps) {
  // It has no onChange handler

  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectPreview</Code>
        <Flex align="center" gap={2}>
          <Box flex={1}>{props.renderDefault(props)}</Box>
          {/* These values *do* exist and come from the schema */}
          {/* But there's currently no way to Type them */}
          {/* {props?.x ? <Code>x:{props.x}</Code> : null} */}
          {/* {props?.y ? <Code>y:{props.y}</Code> : null} */}
        </Flex>
      </Stack>
    </Card>
  )
}
