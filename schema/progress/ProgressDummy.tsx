import {ObjectMember} from 'sanity'
import {Flex, Card, Box} from '@sanity/ui'

type ProgressProps = {
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
    <Card tone={isComplete ? `positive` : `transparent`} border padding={3} radius={2}>
      <Flex align="center" gap={3}>
        <Box>
          {completeCount} / {totalCount} Tasks Complete
        </Box>
      </Flex>
    </Card>
  )
}
