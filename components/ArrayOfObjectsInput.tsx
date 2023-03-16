import React from 'react'
import {ArrayOfObjectsInputProps, insert} from 'sanity'
import {Card, Stack, Code, Autocomplete} from '@sanity/ui'
import {randomKey} from '@sanity/util/content'

// A custom 'input' component replaces the built-in component, below the title and description
// Add to your schema like this:
// components: { input: ArrayOfObjectsInput }
export default function ArrayOfObjectsInput(props: ArrayOfObjectsInputProps<{_key: string}>) {
  const {onChange, schemaType} = props

  // When selected, add a new item to the end of the array
  const handleChange = React.useCallback(
    (value: string) => {
      onChange(insert([{_type: value, _key: randomKey(12)}], 'after', [-1]))
    },
    [onChange]
  )

  console.log(schemaType.of)

  return (
    <Card tone="primary">
      <Stack space={3}>
        <Code>ArrayOfObjectsInput</Code>

        {/* The default Array input */}
        {props.renderDefault(props)}

        {/* See https://www.sanity.io/ui/docs/component/autocomplete */}
        {schemaType.of.length > 0 ? (
          <Autocomplete
            id="array-type-selector"
            options={schemaType.of.map((memberType) => ({
              value: memberType.name,
              type: memberType,
            }))}
            placeholder="Search item type"
            renderOption={({type}) => (
              <Card tone="caution" padding={3} border>
                {type.title}
              </Card>
            )}
            onChange={handleChange}
          />
        ) : null}
      </Stack>
    </Card>
  )
}
