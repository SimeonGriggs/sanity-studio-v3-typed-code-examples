import {useCallback} from 'react'
import {Flex, Button, Menu, MenuButton, MenuItem, MenuDivider, Box} from '@sanity/ui'
import {
  TrashIcon,
  EllipsisVerticalIcon,
  ResetIcon,
  CopyIcon,
  CheckmarkCircleIcon,
  RemoveCircleIcon,
  ClipboardIcon,
} from '@sanity/icons'
import {
  ArrayOfObjectsFunctions,
  ArrayOfObjectsInputProps,
  PatchEvent,
  insert,
  unset,
  useWorkspace,
} from 'sanity'
import {randomKey} from '@sanity/util/content'
import {useLocalStorage} from 'usehooks-ts'

import {useMultiSelectContext} from './MultiSelectContext'
import {ListItemValue} from './types'

export function MultiSelectFunctions(props: ArrayOfObjectsInputProps) {
  const {value, onChange, readOnly} = props
  const {selected, selectAll} = useMultiSelectContext()
  const {projectId, dataset} = useWorkspace()

  const localStorageId = `multi-select-${projectId}-${dataset}-${props.schemaType.type?.name}`
  const [copiedItems, setCopiedItems] = useLocalStorage(localStorageId, ``)

  const handleCopySelected = useCallback(() => {
    if (!selected.length || !value || !value.length) {
      return
    }

    const selectedValues = value.filter((item) => selected.includes(item._key))

    setCopiedItems(JSON.stringify(selectedValues))
  }, [selected, setCopiedItems, value])

  const handlePaste = useCallback(() => {
    if (!copiedItems) {
      return
    }

    const parsedItems = JSON.parse(copiedItems) as ListItemValue[]

    onChange(
      PatchEvent.from(
        parsedItems.map((item) =>
          insert(
            // New key for new item
            [{...item, _key: randomKey(12)}],
            'after',
            [-1]
          )
        )
      )
    )
  }, [copiedItems, onChange])

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
    <MenuButton
      button={
        <Button
          mode="ghost"
          icon={EllipsisVerticalIcon}
          disabled={readOnly}
          text="More actions..."
        />
      }
      id={`${localStorageId}-menu`}
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
            text="Copy selected"
            icon={CopyIcon}
            onClick={handleCopySelected}
            disabled={readOnly || !selected.length || !value || !value.length}
          />
          <MenuItem
            text="Paste items"
            icon={ClipboardIcon}
            onClick={handlePaste}
            disabled={readOnly || !copiedItems}
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
  )
}
