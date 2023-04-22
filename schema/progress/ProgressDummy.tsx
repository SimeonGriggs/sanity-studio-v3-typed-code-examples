// ./schema/preflight/Progress.tsx

import {ObjectInputProps, ObjectMember} from 'sanity'
import {Flex, Card, Box, Stack} from '@sanity/ui'

interface ProgressProps extends ObjectInputProps {
  members: ObjectMember[]
}

type FieldProgress = {
  name: string
  value: boolean
}

export function Progress(props: ProgressProps) {
  const {members = []} = props
  const booleanFieldProgress = members.reduce<FieldProgress[]>((acc, member) => {
    const isFieldMember = member.kind === 'field' && member.field.schemaType.name === 'boolean'

    if (!isFieldMember) {
      return acc
    }

    return [...acc, {name: member.name, value: Boolean(member.field.value)}]
  }, [])
  const totalCount = booleanFieldProgress.length
  const completeCount = booleanFieldProgress.filter((field) => field.value).length
  const isComplete = completeCount === totalCount

  return (
    <Stack space={4}>
      <Card tone={isComplete ? `positive` : `transparent`} border padding={3} radius={2}>
        <Flex align="center" gap={3}>
          <Box>
            {completeCount} / {totalCount} Tasks Complete
          </Box>
        </Flex>
      </Card>
      {/* Render the default form */}
      {props.renderDefault(props)}
    </Stack>
  )
}
