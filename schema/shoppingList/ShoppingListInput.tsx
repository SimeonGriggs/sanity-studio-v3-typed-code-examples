import {useCallback, useState} from 'react'
import {Flex, Button, Menu, MenuButton, MenuItem, MenuDivider, Box} from '@sanity/ui'
import {EllipsisVerticalIcon, ResetIcon, RemoveCircleIcon, CheckmarkCircleIcon} from '@sanity/icons'
import {
  ArrayInputFunctionsProps,
  ArrayOfObjectsFunctions,
  ArrayOfObjectsInputProps,
  ArraySchemaType,
} from 'sanity'
import {ListItemValue} from './types'
import {MultiSelectProvider} from './MultiSelectContext'

function MultiSelectFunctions(props: ArrayInputFunctionsProps<ListItemValue, ArraySchemaType>) {
  return (
    <Flex align="center" gap={1}>
      <Box flex={1}>
        <ArrayOfObjectsFunctions {...props} />
      </Box>
      <MenuButton
        button={<Button mode="ghost" icon={EllipsisVerticalIcon} />}
        id="multi-select-menu"
        menu={
          <Menu>
            <MenuItem
              text="Select..."
              icon={CheckmarkCircleIcon}
              tone="primary"
              // onClick={() => handleSetFocus(cell.item.path)}
            />
            <MenuDivider />
            <MenuItem
              icon={ResetIcon}
              text="Reset cell"
              tone="critical"
              // onClick={() => handleResetCell(cell.item.path)}
            />
            <MenuItem
              icon={RemoveCircleIcon}
              text="Remove cell"
              tone="critical"
              // onClick={() => handleRemoveCell(cell.item.path)}
            />
          </Menu>
        }
        popover={{portal: true}}
      />
    </Flex>
  )
}

export function ShoppingListInput(props: ArrayOfObjectsInputProps) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleSelected = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id]
    )
  }, [])

  return (
    <MultiSelectProvider selected={selected} toggleSelected={toggleSelected}>
      {props.renderDefault({...props, arrayFunctions: MultiSelectFunctions})}
    </MultiSelectProvider>
  )
}
