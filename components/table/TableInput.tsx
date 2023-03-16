import React from 'react'
import {
  Box,
  Grid,
  Card,
  Stack,
  Button,
  Text,
  Flex,
  Switch,
  MenuButton,
  Menu,
  MenuItem,
  MenuDivider,
} from '@sanity/ui'
import {
  EllipsisVerticalIcon,
  CopyIcon,
  EyeOpenIcon,
  AddIcon,
  RemoveCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InsertAboveIcon,
  InsertBelowIcon,
} from '@sanity/icons'
import {
  FormInput,
  FormInsertPatchPosition,
  insert,
  KeyedObject,
  MemberField,
  ObjectInputProps,
  Path,
  set,
  setIfMissing,
  unset,
  usePresenceStore,
} from 'sanity'
import {Feedback} from 'sanity-plugin-utils'
import {randomKey} from '@sanity/util/content'

import {isMemberArrayOfObjects} from './asserters'
import {useDocumentPane} from 'sanity/desk'

export type CellValue = KeyedObject & {
  _type: 'cell'
}

type RowValue = KeyedObject & {
  _type: 'row'
  cells: CellValue[]
}

type TableValue = KeyedObject & {
  _type: 'table'
  rows: RowValue[]
}

function generateEmptyCell(): CellValue {
  return {
    _key: randomKey(12),
    _type: 'cell',
  }
}

function generateEmptyRow(cellCount = 0): RowValue {
  const cells = cellCount ? [...Array(cellCount)].map(() => generateEmptyCell()) : []

  return {
    _key: randomKey(12),
    _type: 'row',
    cells,
  }
}

export default function TableInput(props: ObjectInputProps<TableValue>) {
  const {onChange, value} = props
  const {compact = true} = props.schemaType.options || {}

  const [nativeInput, setNativeInput] = React.useState(false)

  const pane = useDocumentPane()

  const handleSetFocus = React.useCallback(
    (path: Path) => {
      pane.onPathOpen(path)
    },
    [pane]
  )

  const handleRemoveRow = React.useCallback(
    (key: string) => {
      onChange(unset(['rows', {_key: key}]))
    },
    [onChange]
  )

  const handleRemoveColumn = React.useCallback(
    (index: number) => {
      if (!value?.rows?.length) {
        return
      }

      const columnUnsets = value.rows.map((r) => unset(['rows', {_key: r._key}, 'cells', index]))
      onChange(columnUnsets)
    },
    [onChange, value]
  )

  const handleInsertRow = React.useCallback(
    (index: number, position: FormInsertPatchPosition) => {
      const {rows = []} = value || {}
      const clickedOrLastRow =
        index < 0 && rows?.length
          ? rows[index < 0 && rows.length ? rows.length - 1 : index]
          : rows[index]
      const newRow = [generateEmptyRow(clickedOrLastRow ? clickedOrLastRow.cells.length : 1)]
      const rowInsert = insert(newRow, position, ['rows', index])

      onChange([setIfMissing([], ['rows']), rowInsert])
    },
    [onChange, value]
  )

  const handleInsertColumn = React.useCallback(
    (index: number, position: FormInsertPatchPosition) => {
      if (!value?.rows?.length) {
        return
      }

      const columnInserts = value.rows.map((r) =>
        insert([generateEmptyCell()], position, ['rows', {_key: r._key}, 'cells', index])
      )
      onChange(columnInserts)
    },
    [onChange, value]
  )

  const handleInsertCell = React.useCallback(
    (key: string) => {
      const path = ['rows', {_key: key}, 'cells']
      const cellInsert = set([generateEmptyCell()], path)
      onChange([setIfMissing([], path), cellInsert])
    },
    [onChange]
  )

  const handleDuplicateRow = React.useCallback(
    (index: number) => {
      const {rows = []} = value || {}
      const clickedRow = rows[index]
      const newRow = {
        ...clickedRow,
        _key: randomKey(12),
        cells: clickedRow?.cells?.length
          ? clickedRow.cells.map((cell) => ({
              ...cell,
              _key: randomKey(12),
            }))
          : [],
      }
      const rowInsert = insert([newRow], 'after', ['rows', index])

      onChange([rowInsert])
    },
    [onChange, value]
  )

  // TODO: handleDragColumn
  // TODO: handleDragRow

  return (
    <Stack space={4}>
      <Card border padding={2}>
        <Flex justify="flex-start" align="center" gap={2}>
          <Switch checked={nativeInput} onChange={() => setNativeInput(!nativeInput)} />
          <Text>Show native input</Text>
        </Flex>
      </Card>

      {nativeInput ? (
        props.renderDefault(props)
      ) : props.members.length > 0 ? (
        props.members.map((tableMember) => {
          if (tableMember.kind === 'error') {
            return (
              <Feedback
                key={tableMember.key}
                tone="critical"
                title="Error"
                description="There is an error with this table"
              />
            )
          }

          if (tableMember.kind === 'fieldSet') {
            return (
              <Feedback
                key={tableMember.key}
                tone="critical"
                title="UNFINISHED: Support fieldsets"
              />
            )
          }

          if (!isMemberArrayOfObjects(tableMember)) {
            return (
              <Feedback
                key={tableMember.key}
                tone="critical"
                title="This member is not an array of objects"
              />
            )
          }

          return (
            <Stack key={tableMember.key} space={1}>
              {/* Rendered but hidden to render modals when focusPath updated */}
              <div style={{display: `none`}}>{props.renderDefault(props)}</div>

              {tableMember.field.members.map((row, rowIndex) => {
                const isLastRow = tableMember.field.members.length - 1 === rowIndex

                if (row.kind === 'error') {
                  return (
                    <Feedback
                      key={row.key}
                      tone="critical"
                      title="Error"
                      description="There is an error with this row"
                    />
                  )
                }

                return (
                  <Stack key={row.key} space={1}>
                    {row.item.members.length > 0 ? (
                      <Stack space={1}>
                        {row.item.members.map((rowMember) => {
                          if (rowMember.kind === 'error') {
                            return (
                              <Feedback
                                key={rowMember.key}
                                tone="critical"
                                title="There is an error with this row member"
                              />
                            )
                          }

                          if (rowMember.kind === 'fieldSet') {
                            return (
                              <Feedback
                                key={rowMember.key}
                                tone="critical"
                                title="UNFINISHED: Support fieldsets"
                              />
                            )
                          }

                          if (!isMemberArrayOfObjects(rowMember)) {
                            return (
                              <Feedback
                                key={rowMember.key}
                                tone="critical"
                                title="This member is not an array of objects"
                              />
                            )
                          }

                          return (
                            <Stack key={rowMember.key} space={1}>
                              <Flex align="center" gap={3}>
                                {rowMember?.field?.members?.length > 0 ? (
                                  <Box flex={1}>
                                    <Grid gap={1} columns={rowMember?.field?.members?.length}>
                                      {rowMember.field.members.map((cell, cellIndex) => {
                                        if (cell.kind === 'error') {
                                          return (
                                            <Feedback
                                              key={cell.key}
                                              tone="critical"
                                              title="There is an error with this cell"
                                            />
                                          )
                                        }

                                        if (!cell.item.members.length) {
                                          return (
                                            <Feedback
                                              key={cell.key}
                                              tone="caution"
                                              title="Cell has no members"
                                            />
                                          )
                                        }

                                        return (
                                          <Flex key={cell.key} gap={1}>
                                            <Stack space={1}>
                                              {cell.item.members.map((cellMember) => {
                                                if (cellMember.kind === 'error') {
                                                  return (
                                                    <Feedback
                                                      key={cellMember.key}
                                                      tone="critical"
                                                      title="There is an error with this cell member"
                                                    />
                                                  )
                                                }

                                                if (cellMember.kind === 'fieldSet') {
                                                  return (
                                                    <Feedback
                                                      key={cellMember.key}
                                                      tone="critical"
                                                      title="UNFINISHED: Support fieldsets"
                                                    />
                                                  )
                                                }

                                                if (compact) {
                                                  return (
                                                    <FormInput
                                                      key={cellMember.key}
                                                      {...props}
                                                      absolutePath={[
                                                        ...cell.item.path,
                                                        cellMember.name,
                                                      ]}
                                                    />
                                                  )
                                                }

                                                return (
                                                  <MemberField
                                                    key={cellMember.key}
                                                    member={cellMember}
                                                    renderInput={() => (
                                                      <FormInput
                                                        {...props}
                                                        absolutePath={[
                                                          ...cell.item.path,
                                                          cellMember.name,
                                                        ]}
                                                      />
                                                    )}
                                                    renderField={props.renderField}
                                                    renderItem={props.renderItem}
                                                    renderPreview={props.renderPreview}
                                                  />
                                                )
                                              })}
                                            </Stack>

                                            <MenuButton
                                              button={
                                                <Button mode="ghost" icon={EllipsisVerticalIcon} />
                                              }
                                              id={`table-column-menu-${row.key}`}
                                              menu={
                                                <Menu>
                                                  <MenuItem
                                                    icon={ChevronLeftIcon}
                                                    text="Insert Column Before"
                                                    tone="primary"
                                                    onClick={() =>
                                                      handleInsertColumn(cellIndex, 'before')
                                                    }
                                                  />
                                                  <MenuItem
                                                    iconRight={ChevronRightIcon}
                                                    text="Insert Column After"
                                                    tone="primary"
                                                    onClick={() =>
                                                      handleInsertColumn(cellIndex, 'after')
                                                    }
                                                  />
                                                  <MenuDivider />
                                                  <MenuItem
                                                    text="Open Cell"
                                                    icon={EyeOpenIcon}
                                                    tone="primary"
                                                    onClick={() => handleSetFocus(cell.item.path)}
                                                  />
                                                  <MenuDivider />
                                                  <MenuItem
                                                    icon={RemoveCircleIcon}
                                                    text="Remove Column"
                                                    tone="critical"
                                                    onClick={() => handleRemoveColumn(cellIndex)}
                                                  />
                                                </Menu>
                                              }
                                              popover={{portal: true}}
                                            />
                                          </Flex>
                                        )
                                      })}
                                    </Grid>
                                  </Box>
                                ) : (
                                  <Card tone="primary" flex={1} padding={2}>
                                    <Flex align="center" justify="center">
                                      <Button
                                        icon={AddIcon}
                                        text="Add Cell"
                                        tone="primary"
                                        onClick={() => handleInsertCell(row.key)}
                                      />
                                    </Flex>
                                  </Card>
                                )}

                                <MenuButton
                                  button={<Button mode="ghost" icon={EllipsisVerticalIcon} />}
                                  id={`table-row-menu-${row.key}`}
                                  menu={
                                    <Menu>
                                      <MenuItem
                                        icon={InsertAboveIcon}
                                        text="Insert Row Before"
                                        onClick={() => handleInsertRow(rowIndex, 'before')}
                                      />
                                      <MenuItem
                                        icon={InsertBelowIcon}
                                        text="Insert Row After"
                                        onClick={() => handleInsertRow(rowIndex, 'after')}
                                      />
                                      <MenuItem
                                        icon={CopyIcon}
                                        text="Duplicate Row"
                                        onClick={() => handleDuplicateRow(rowIndex)}
                                      />
                                      <MenuDivider />
                                      <MenuItem
                                        icon={EyeOpenIcon}
                                        tone="primary"
                                        text="Open Row"
                                        onClick={() => handleSetFocus(row.item.path)}
                                      />
                                      <MenuDivider />
                                      <MenuItem
                                        icon={RemoveCircleIcon}
                                        tone="critical"
                                        text="Remove Row"
                                        onClick={() => handleRemoveRow(row.key)}
                                      />
                                    </Menu>
                                  }
                                  popover={{portal: true}}
                                />
                              </Flex>
                            </Stack>
                          )
                        })}
                      </Stack>
                    ) : (
                      <Feedback tone="caution" title="Row has no members" />
                    )}
                  </Stack>
                )
              })}
              <Stack paddingTop={4} flex={1}>
                <Button
                  tone="primary"
                  text="Add row"
                  icon={AddIcon}
                  onClick={() => handleInsertRow(-1, 'after')}
                />
              </Stack>
            </Stack>
          )
        })
      ) : (
        <Feedback tone="caution" title="Table has no rows" />
      )}
    </Stack>
  )
}
