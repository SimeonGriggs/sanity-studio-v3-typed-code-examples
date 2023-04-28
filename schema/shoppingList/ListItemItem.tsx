import {ObjectInputMember, ObjectItemProps} from 'sanity'
import {ChevronUpIcon, ChevronDownIcon, CheckmarkCircleIcon, CircleIcon} from '@sanity/icons'
import {Stack, Text, Card, Flex, Box, Button} from '@sanity/ui'
import {useState, MouseEvent, useCallback} from 'react'

import {ListItemValue} from './types'
import {useMultiSelectContext} from './MultiSelectContext'
import {CircleButton} from './CircleButton'

export function ListItemItem(props: ObjectItemProps<ListItemValue>) {
  const [collapsed, setCollapsed] = useState(true)
  const {selected, toggleSelected} = useMultiSelectContext()
  const isSelected = selected.includes(props.value._key)

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      toggleSelected(event.currentTarget.value)
    },
    [toggleSelected]
  )

  const {members} = props.inputProps

  const renderProps = {
    renderField: props.inputProps.renderField,
    renderInput: props.inputProps.renderInput,
    renderItem: props.inputProps.renderItem,
    renderPreview: props.inputProps.renderPreview,
  }

  return (
    <Card paddingLeft={2}>
      <Flex align="center">
        <CircleButton
          tone={isSelected ? `primary` : `default`}
          value={props.value._key}
          mode={isSelected ? `default` : `bleed`}
          onClick={handleClick}
          padding={2}
        >
          <Text size={3}>{isSelected ? <CheckmarkCircleIcon /> : <CircleIcon />}</Text>
        </CircleButton>

        {collapsed ? (
          <Box flex={1}>{props.renderDefault(props)}</Box>
        ) : (
          <Box flex={1} paddingLeft={3} paddingRight={0} paddingTop={2} paddingBottom={3}>
            <Stack space={3}>
              {members.map((member) => (
                <ObjectInputMember key={member.key} member={member} {...renderProps} />
              ))}
            </Stack>
          </Box>
        )}

        <Box paddingX={2}>
          <Button
            title={collapsed ? 'Expand' : 'Collapse'}
            icon={collapsed ? ChevronDownIcon : ChevronUpIcon}
            mode={collapsed ? 'bleed' : 'default'}
            onClick={() => setCollapsed((current) => !current)}
          />
        </Box>
      </Flex>
    </Card>
  )
}
