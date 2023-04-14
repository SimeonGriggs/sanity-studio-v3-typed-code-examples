import React, {PropsWithChildren} from 'react'
import {Stack, Button, MenuButton, Menu, MenuItem, MenuDivider} from '@sanity/ui'
import {Row, Cell} from 'sanity-plugin-utils'
import {
  TrashIcon,
  EllipsisVerticalIcon,
  CopyIcon,
  ClipboardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@sanity/icons'

import {getAlphabetIndex} from './lib/getAlphabetIndex'
import {CellPosition, CellValue, LooseCellValue, TableValue} from './types'
import {generatePositionFromString} from './lib/generatePositionFromString'
import {
  ArrayOfObjectsItemMember,
  FormInsertPatchPosition,
  ObjectArrayFormNode,
  ObjectSchemaType,
  insert,
  unset,
} from 'sanity'
import {generatePositionString} from './lib/generatePositionString'
import {LexoRank} from 'lexorank'

type ColControlsProps = PropsWithChildren & {
  count: number
  focused: CellPosition | null
  firstRow: ArrayOfObjectsItemMember<ObjectArrayFormNode<LooseCellValue, ObjectSchemaType>>[]
  value: TableValue
  onChange: (value: any[]) => void
}

export default function ColControls(props: ColControlsProps) {
  const {count, children, focused, firstRow = [], onChange, value} = props

  // TODO: I'm not sure this is reliable,
  // the table will have to make sure every column gets the same 'rank'
  const focusedRowIndex = focused?.row
    ? firstRow.findIndex((cell) => generatePositionFromString(cell.key).col === focused.col)
    : -1

  const handleInsertColumn = React.useCallback(
    (index: number, position: FormInsertPatchPosition, duplicate = false) => {
      // This may not be safe to compare the index with
      const firstRowValues = firstRow
        .map((cell) => (cell.kind === 'item' ? cell.item.value : null))
        .filter(Boolean)

      if (!firstRowValues?.length) {
        return
      }

      const clickedCol = firstRowValues[index]
      const otherColIndex = position === 'after' ? index + 1 : index - 1
      const otherCol = firstRowValues[otherColIndex]

      if (!clickedCol) {
        throw new Error('Could not find clicked column')
      }

      const clickedColRank = generatePositionFromString(clickedCol._key).col
      let otherColRank: LexoRank

      // Generate a new or in-between rank
      if (index <= 0 && position === 'before') {
        otherColRank = LexoRank.parse(clickedColRank).genPrev()
      } else if (index >= firstRowValues.length - 1 && position === 'after') {
        otherColRank = LexoRank.parse(clickedColRank).genNext()
      } else if (!otherCol) {
        throw new Error('Could not find other column')
      } else {
        otherColRank = LexoRank.parse(generatePositionFromString(otherCol._key).col)
      }

      const newColRank = LexoRank.parse(clickedColRank).between(otherColRank).toString()

      // Find the column cells to duplicate or insert before/after
      const clickedColCells = value.cells.filter((cell) => {
        const cellPosition = generatePositionFromString(cell._key)
        return cellPosition.col === clickedColRank
      })

      // Map over every existing column to generate new order keys and insertion points
      const columnInserts = clickedColCells
        .map((cell) => {
          if (!cell) {
            return null
          }

          const currentPosition = generatePositionFromString(cell._key)
          const newRank = generatePositionString({
            ...currentPosition,
            col: newColRank,
          })
          const newCell: CellValue = duplicate
            ? {...cell, _key: newRank}
            : {_key: newRank, _type: 'cell'}

          return insert([newCell], position, ['cells', {_key: cell._key}])
        })
        .filter(Boolean)

      onChange(columnInserts)
    },
    [onChange, firstRow, value.cells]
  )

  const handleRemoveColumn = React.useCallback(
    (index: number) => {
      if (!value?.cells?.length) {
        return
      }

      // This may not be safe to compare the index with
      const firstRowValues = firstRow
        .map((cell) => (cell.kind === 'item' ? cell.item.value : null))
        .filter(Boolean)

      if (!firstRowValues?.length) {
        return
      }

      const clickedCol = firstRowValues[index]

      if (!clickedCol) {
        throw new Error('Could not find clicked column')
      }

      const clickedColRank = generatePositionFromString(clickedCol._key).col

      // Find the column cells to duplicate or insert before/after
      const clickedColCells = value.cells.filter((cell) => {
        const cellPosition = generatePositionFromString(cell._key)
        return cellPosition.col === clickedColRank
      })

      const columnUnsets = clickedColCells.map((cell) => unset(['cells', {_key: cell._key}]))
      onChange(columnUnsets)
    },
    [onChange, value]
  )

  return (
    <thead>
      <Row>
        {[...Array(count)].map((_, cellIndex) => {
          const cellIsFirst = cellIndex === 0
          const cellIsLast = cellIndex === count - 1
          const cellIsFocused = focusedRowIndex === cellIndex

          return (
            <Cell key={cellIndex} padding={0.5} paddingBottom={2}>
              <MenuButton
                button={
                  <Stack>
                    <Button
                      tone="primary"
                      mode={cellIsFocused ? 'default' : 'ghost'}
                      paddingY={2}
                      style={{
                        borderRadius: cellIsFirst ? '3px 0 0 3px' : cellIsLast ? '0 3px 3px 0' : 0,
                      }}
                      textAlign="center"
                      text={getAlphabetIndex(cellIndex)}
                    />
                  </Stack>
                }
                id={`table-column-header-menu-${cellIndex}`}
                menu={
                  <Menu>
                    <MenuItem
                      icon={ChevronLeftIcon}
                      text="Insert column before"
                      tone="primary"
                      onClick={() => handleInsertColumn(cellIndex, 'before')}
                    />
                    <MenuItem
                      iconRight={ChevronRightIcon}
                      text="Insert column after"
                      tone="primary"
                      onClick={() => handleInsertColumn(cellIndex, 'after')}
                    />
                    <MenuDivider />
                    <MenuItem
                      icon={CopyIcon}
                      text="Duplicate column"
                      tone="primary"
                      onClick={() => handleInsertColumn(cellIndex, 'after', true)}
                    />
                    <MenuDivider />
                    <MenuItem
                      icon={TrashIcon}
                      text="Remove column"
                      tone="critical"
                      onClick={() => handleRemoveColumn(cellIndex)}
                    />
                  </Menu>
                }
                popover={{portal: true}}
              />
            </Cell>
          )
        })}
        {children}
      </Row>
    </thead>
  )
}
