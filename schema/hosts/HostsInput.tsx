import {Grid, Stack, Button} from '@sanity/ui'
import {AddIcon} from '@sanity/icons'
import {randomKey} from '@sanity/util/content'
import {ArrayOfObjectsInputProps, Reference, insert, setIfMissing, useClient} from 'sanity'
import {useCallback} from 'react'
import {DEPARTMENTS} from './personType'

export function HostsInput(props: ArrayOfObjectsInputProps) {
  const {onChange} = props

  const client = useClient({apiVersion: `2023-04-01`})

  // When a department button is clicked
  const handleClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      // Find the value of the button, the department name
      const department = event.currentTarget.value

      const query = `*[
        _type == "person" && 
        department == $department && 
        !(_id in path("drafts.**")
      ]._id`
      const peopleIds: string[] = (await client.fetch(query, {department})) ?? []
      const peopleReferences: Reference[] = peopleIds.map((personId) => ({
        _key: randomKey(12),
        _type: `host`,
        _ref: personId,
      }))

      // Individually "insert" items to append to the end of the array
      const peoplePatches = peopleReferences.map((personReference) =>
        insert([personReference], 'after', [-1])
      )

      // Patch the document
      onChange([setIfMissing([]), ...peoplePatches])

      // To reset the array instead you'd do this:
      // onChange(set(peopleReferences))
    },
    [onChange, client]
  )

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Grid columns={DEPARTMENTS.length} gap={1}>
        {DEPARTMENTS.map((department) => (
          <Button
            key={department.value}
            value={department.value}
            icon={AddIcon}
            text={department.title}
            mode="ghost"
            onClick={handleClick}
          />
        ))}
      </Grid>
    </Stack>
  )
}
