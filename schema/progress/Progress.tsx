// ./schema/preflight/Progress.tsx

import {ObjectInputProps, ObjectMember, TextWithTone} from 'sanity'
import {Flex, Card, Box, Stack} from '@sanity/ui'
import {hues} from '@sanity/color'
import {CircularProgressbarWithChildren} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface ProgressProps extends ObjectInputProps {
  members: ObjectMember[]
}

type FieldProgress = {
  name: string
  value: boolean
}

export function Progress(props: ProgressProps) {
  const {members} = props
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
  const percentage = Math.round((completeCount / totalCount) * 100)

  return (
    <Stack space={4}>
      <Card tone={isComplete ? `positive` : `transparent`} border padding={3} radius={2}>
        <Flex align="center" gap={3}>
          <Box style={{maxWidth: 70}}>
            <CircularProgressbarWithChildren
              value={percentage}
              styles={{
                path: {stroke: hues.green[500].hex},
                trail: {stroke: hues.gray[100].hex},
                text: {fill: hues.green[500].hex},
              }}
            >
              <TextWithTone tone={isComplete ? `positive` : `default`} size={2} weight="semibold">
                {percentage}%
              </TextWithTone>
            </CircularProgressbarWithChildren>
          </Box>
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
