import React from 'react'
import {PreviewProps} from 'sanity'
import {Stack, Card, Code, Flex, Box} from '@sanity/ui'

/**
 * A "preview" component doesn't have a way to pass in a Type for the Value
 * It just inherits whatever your schema declared in its `preview` key
 * Into the `title` and `subtitle` keys
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
        </Flex>
      </Stack>
    </Card>
  )
}
