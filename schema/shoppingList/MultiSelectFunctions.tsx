import {useCallback} from 'react'
import {Flex, Button, Menu, MenuButton, MenuItem, MenuDivider, Box} from '@sanity/ui'
import {
  TrashIcon,
  EllipsisVerticalIcon,
  ResetIcon,
  CopyIcon,
  CheckmarkCircleIcon,
  RemoveCircleIcon,
} from '@sanity/icons'
import {
  ArrayInputFunctionsProps,
  ArrayOfObjectsFunctions,
  ArraySchemaType,
  PatchEvent,
  insert,
  unset,
} from 'sanity'
import {randomKey} from '@sanity/util/content'

import {useMultiSelectContext} from './MultiSelectContext'
import {ListItemValue} from './types'

export function MultiSelectFunctions(
  props: ArrayInputFunctionsProps<ListItemValue, ArraySchemaType>
) {
  const {value, onChange, readOnly} = props
  const {selected, selectAll} = useMultiSelectContext()

  const handleSelectAll = useCallback(() => {
    const keys = value && value.length ? value.map((item) => item._key) : null
    if (keys) {
      selectAll(keys)
    }
  }, [selectAll, value])

  const handleSelectNone = useCallback(() => {
    selectAll([])
  }, [selectAll])

  const handleDuplicateSelected = useCallback(() => {
    if (!selected.length || !value || !value.length) {
      return
    }

    const selectedValues = value.filter((item) => selected.includes(item._key))

    onChange(
      PatchEvent.from(
        selectedValues.map((item) =>
          insert(
            // New key for new item
            [{...item, _key: randomKey(12)}],
            // position
            'after',
            // Old key for insert position
            [{_key: item._key}]
          )
        )
      )
    )
  }, [onChange, selected, value])

  const handleRemoveSelected = useCallback(() => {
    if (!selected.length) {
      return
    }

    const selectedAsKeys = selected.map((key) => ({_key: key}))
    onChange(PatchEvent.from(selectedAsKeys.map((path) => unset([path]))))
  }, [onChange, selected])

  const handleRemoveAll = useCallback(() => {
    if (!value || !value.length) {
      return
    }

    const valueKeys = value.map(({_key}) => ({_key}))
    onChange(PatchEvent.from(valueKeys.map((path) => unset([path]))))
  }, [onChange, value])

  return (
    <Flex align="center" gap={1}>
      <Box flex={1}>
        <ArrayOfObjectsFunctions {...props} />
      </Box>
      <MenuButton
        button={<Button mode="ghost" icon={EllipsisVerticalIcon} disabled={readOnly} />}
        id="multi-select-menu"
        menu={
          <Menu>
            <MenuItem
              text="Select all"
              icon={CheckmarkCircleIcon}
              onClick={handleSelectAll}
              disabled={readOnly || !value || !value.length}
            />
            <MenuItem
              text="Clear selection"
              icon={ResetIcon}
              onClick={handleSelectNone}
              disabled={readOnly || !selected.length || !value || !value.length}
            />
            <MenuItem
              text="Duplicate selected"
              icon={CopyIcon}
              onClick={handleDuplicateSelected}
              disabled={readOnly || !selected.length || !value || !value.length}
            />
            <MenuDivider />
            <MenuItem
              icon={RemoveCircleIcon}
              text="Remove selected"
              tone="critical"
              disabled={readOnly || !selected.length || !value || !value.length}
              onClick={handleRemoveSelected}
            />
            <MenuDivider />
            <MenuItem
              icon={TrashIcon}
              text="Remove all"
              tone="critical"
              onClick={handleRemoveAll}
              disabled={readOnly || !value || !value.length}
            />
          </Menu>
        }
        popover={{portal: true}}
      />
    </Flex>
  )
}
