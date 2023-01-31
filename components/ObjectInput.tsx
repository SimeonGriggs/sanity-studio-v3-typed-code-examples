import React, {useCallback} from 'react'
import {ObjectInputProps, set, setIfMissing, unset} from 'sanity'
import {Card, Stack, Code, Button, Flex} from '@sanity/ui'

// This sets the type of the `value` prop inside the component
// All keys must be optional, since the object may be empty
type ObjectValue = {
  _type?: 'coordinate'
  x?: number
  y?: number
}

// Create random number between -100 and 100
function random() {
  return Math.floor(Math.random() * 200) - 100
}

// A custom 'input' component replaces the built-in component, below the title and description
// Add to your schema like this:
// components: { input: ObjectInput }
export default function ObjectInput(props: ObjectInputProps<ObjectValue>) {
  const {value, onChange} = props

  // Set a value with a path, so other values in the object are untouched
  const handleSetX = useCallback(() => {
    onChange([
      // Native inputs would add this key if missing
      setIfMissing('coordinate', ['_type']),
      set(random(), [`x`]),
    ])
  }, [onChange])

  const handleSetY = useCallback(() => {
    onChange([setIfMissing('coordinate', ['_type']), set(random(), [`y`])])
  }, [onChange])

  // If 'y' is set, remove just this one field from the object
  // Otherwise unset the entire object
  const handleUnsetX = useCallback(() => {
    onChange(value?.y ? unset(['x']) : unset())
  }, [onChange, value])

  // If 'x' is set, remove just this one field from the object
  // Otherwise unset the entire object
  const handleUnsetY = useCallback(() => {
    onChange(value?.x ? unset(['y']) : unset())
  }, [onChange, value])

  // Reset the entire object, since we're resetting both values
  const handleSetBoth = useCallback(() => {
    onChange(set({_type: 'coordinate', x: random(), y: random()}))
  }, [onChange])

  // Remove the entire object from the document
  const handleUnset = useCallback(() => {
    onChange(unset())
  }, [onChange])

  // Because these are number fields, they could be 0
  const hasX = value?.x !== undefined
  const hasY = value?.y !== undefined

  return (
    <Card tone="primary">
      <Stack space={2}>
        <Code>ObjectInput</Code>
        {props.renderDefault(props)}
        <Flex gap={1}>
          <Button fontSize={1} text={hasX ? `Change X` : `Set X`} onClick={handleSetX} />
          <Button fontSize={1} text="Unset X" disabled={!hasX} onClick={handleUnsetX} />
          <Button fontSize={1} text={hasY ? `Change Y` : `Set Y`} onClick={handleSetY} />
          <Button fontSize={1} text="Unset Y" disabled={!hasY} onClick={handleUnsetY} />
          <Button
            fontSize={1}
            text={hasX || hasY ? `Change Both` : 'Set Both'}
            onClick={handleSetBoth}
          />
          <Button fontSize={1} text="Unset Both" disabled={!hasX && !hasY} onClick={handleUnset} />
        </Flex>
      </Stack>
    </Card>
  )
}
