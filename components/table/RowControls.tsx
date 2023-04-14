import React from 'react'
import {Button, MenuButton, Menu, MenuItem, MenuDivider} from '@sanity/ui'
import {TrashIcon, CopyIcon, InsertAboveIcon, InsertBelowIcon, EyeOpenIcon} from '@sanity/icons'
import {Cell} from 'sanity-plugin-utils'
import {FormInsertPatchPosition, insert, setIfMissing, unset} from 'sanity'

import {CellValue, OnChange, TableValue} from './types'
import {generateEmptyCells} from './lib/generateEmptyCells'
import {generatePositionFromString} from './lib/generatePositionFromString'
import {generatePositionString} from './lib/generatePositionString'
import {LexoRank} from 'lexorank'

type RowControlsProps = {
  isFocused: boolean
  rowOrder: string
  rowIsLast: boolean
  rowIsFirst: boolean
  rowIndex: number
  onChange: OnChange
  lastColNumber: number
  value?: TableValue
}

export default function RowControls(props: RowControlsProps) {
  const {
    isFocused = false,
    rowOrder,
    rowIsLast,
    rowIsFirst,
    rowIndex,
    onChange,
    lastColNumber,
    value,
  } = props

  const handleInsertRow = React.useCallback(
    (position: FormInsertPatchPosition, duplicate = false) => {
      if (!value?.cells) {
        return
      }

      const {cells = []} = value || {}

      if (!cells.length) {
        return
      }

      // Calculate path for insertion in the flat "cells" array
      // Not actually required, because we don't use that order, but nice to have
      const rowCells = cells.filter((c) => c._key.startsWith(rowOrder))
      const lastRowCellRank = rowCells[rowCells.length - 1]._key
      const firstRowCellRank = rowCells[0]._key
      const insertPath = [
        'cells',
        {_key: position === 'after' ? lastRowCellRank : firstRowCellRank},
      ]

      // Generate new rank for this row
      const otherRowCellIndex =
        position === 'after'
          ? cells.findIndex((c) => c._key === lastRowCellRank)
          : cells.findIndex((c) => c._key === firstRowCellRank)

      let newRowRank: string

      if (
        // Index not found
        otherRowCellIndex < 0 ||
        // First index
        (position === 'before' && otherRowCellIndex === 0) ||
        // Last index
        (position === 'after' && otherRowCellIndex === cells.length - 1)
      ) {
        newRowRank =
          position === 'after'
            ? LexoRank.parse(rowOrder).genNext().toString()
            : LexoRank.parse(rowOrder).genPrev().toString()
      } else {
        const otherRowCellRank =
          position === 'after'
            ? generatePositionFromString(cells[otherRowCellIndex + 1]._key).row
            : generatePositionFromString(cells[otherRowCellIndex - 1]._key).row
        newRowRank = LexoRank.parse(rowOrder).between(LexoRank.parse(otherRowCellRank)).toString()
      }

      // Map over the cells in the row and generate new cells
      let newRow: CellValue[] = rowCells.map((c) => {
        const cellPosition = generatePositionFromString(c._key)
        const newCellKey = generatePositionString({
          ...cellPosition,
          row: newRowRank,
        })

        if (duplicate) {
          return {
            ...c,
            _key: newCellKey,
          }
        }

        return {
          _key: newCellKey,
          _type: c._type,
        }
      })

      if (newRow.length) {
        const rowInsert = insert(newRow, position, insertPath)
        onChange([setIfMissing([], ['cells']), rowInsert])
      }
    },
    [onChange, rowOrder, value]
  )

  const handleRemoveRow = React.useCallback(() => {
    if (!value) {
      return
    }

    const fullKeys = value.cells
      .filter((c) => c._key.startsWith(rowOrder))
      .map((c) => ({_key: c._key}))
      .filter(Boolean)
      .map((path) => unset(['cells', path]))

    if (fullKeys.length) {
      onChange(fullKeys)
    }
  }, [onChange, rowOrder, value])

  return (
    <Cell padding={0.5} paddingLeft={2}>
      <MenuButton
        button={
          <Button
            mode={isFocused ? 'default' : 'ghost'}
            tone="primary"
            radius={0}
            style={{
              borderRadius: rowIsFirst ? '3px 3px 0 0' : rowIsLast ? '0 0 3px 3px' : 0,
              width: `100%`,
            }}
            text={rowIndex.toString()}
          />
        }
        id={`table-row-menu-${rowOrder}`}
        menu={
          <Menu>
            <MenuItem
              icon={InsertAboveIcon}
              text="Insert row before"
              disabled={!value}
              onClick={() => handleInsertRow('before')}
            />
            <MenuItem
              icon={InsertBelowIcon}
              text="Insert row after"
              disabled={!value}
              onClick={() => handleInsertRow('after')}
            />
            <MenuItem
              icon={CopyIcon}
              text="Duplicate row"
              disabled={!value}
              onClick={() => handleInsertRow('after', true)}
            />
            <MenuDivider />
            <MenuItem
              icon={TrashIcon}
              tone="critical"
              text="Remove row"
              disabled={!value}
              onClick={handleRemoveRow}
            />
          </Menu>
        }
        popover={{portal: true}}
      />
    </Cell>
  )
}
