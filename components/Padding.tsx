import {PropsWithChildren} from 'react'
import {Card} from '@sanity/ui'

// Element to give the editing form more padding for nicer screenshots :)
export default function Padding({children}: PropsWithChildren) {
  return (
    <Card padding={5} paddingX={6}>
      {children}
    </Card>
  )
}
