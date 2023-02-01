import React from 'react'
import {PreviewProps, typed} from 'sanity'
import {Stack, Card, Code, Flex, Box} from '@sanity/ui'

/**
 * A "preview" component doesn't have a way to pass in a Type for the Value
 * It just inherits whatever your schema declared in its `preview` key
 * Usually `preview` just returns title, subtitle and media
 * It can also return arbitrary values, but if you want to use them
 * AND satisfy TypeScript, you'll need to recast the props
 */

type ArbitraryPreviewProps = PreviewProps & {
  x?: number
  y?: number
}

// This component is used when Objects are displayed in Arrays
export default function ObjectPreviewRetyped(props: PreviewProps) {
  // It has no onChange handler

  // In this component we're customising the PreviewProps
  // to include the abitrary values we added in the schema
  const castProps = typed<ArbitraryPreviewProps>(props)

  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectPreview</Code>
        <Flex align="center" gap={2}>
          <Box flex={1}>{props.renderDefault(props)}</Box>
          {castProps?.x ? <Code>x:{castProps.x}</Code> : null}
          {castProps?.y ? <Code>y:{castProps.y}</Code> : null}
        </Flex>
      </Stack>
    </Card>
  )
}
