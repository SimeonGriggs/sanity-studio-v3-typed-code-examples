import {PropsWithChildren} from 'react'
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
import {CellPosition, LooseCellValue} from './types'
import {generatePositionFromString} from './lib/generatePositionFromString'
import {ArrayOfObjectsItemMember, ObjectArrayFormNode, ObjectSchemaType} from 'sanity'

type ColControlsProps = PropsWithChildren & {
  count: number
  focused: CellPosition | null
  firstRow: ArrayOfObjectsItemMember<ObjectArrayFormNode<LooseCellValue, ObjectSchemaType>>[]
}

export default function ColControls(props: ColControlsProps) {
  const {count, children, focused, firstRow} = props

  // TODO: I'm not sure this is reliable,
  // the table will have to make sure every column gets the same 'rank'
  const focusedRowIndex = focused?.row
    ? firstRow.findIndex((cell) => generatePositionFromString(cell.key).col === focused.col)
    : -1

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
                      // onClick={() => handleInsertColumn(cellIndex, 'before')}
                    />
                    <MenuItem
                      iconRight={ChevronRightIcon}
                      text="Insert column after"
                      tone="primary"
                      // onClick={() => handleInsertColumn(cellIndex, 'after')}
                    />
                    <MenuDivider />
                    <MenuItem
                      icon={CopyIcon}
                      text="Duplicate column"
                      tone="primary"
                      // onClick={() => handleDuplicateColumn(cellIndex)}
                    />
                    <MenuDivider />
                    <MenuItem
                      icon={TrashIcon}
                      text="Remove column"
                      tone="critical"
                      // onClick={() => handleRemoveColumn(cellIndex)}
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
