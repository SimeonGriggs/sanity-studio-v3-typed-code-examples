import React from 'react'
import {
  Box,
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
import {Feedback, Cell, Row, Table} from 'sanity-plugin-utils'
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

  const handleFillRowWithCells = React.useCallback(
    (key: string, count: number) => {
      const {cells: newCells} = generateEmptyRow(count)
      const cellsInsert = newCells.map((newCell) =>
        insert([newCell], 'after', ['rows', {_key: key}, 'cells', -1])
      )
      onChange(cellsInsert)
    },
    [onChange]
  )

  const mostRowColumns =
    value?.rows?.reduce((acc, row) => {
      return row.cells.length > acc ? row.cells.length : acc
    }, 0) ?? 0

  return (
    <Stack space={4}>
      <Card border padding={2}>
        <Flex justify="flex-start" align="center" gap={2}>
          <Switch checked={nativeInput} onChange={() => setNativeInput(!nativeInput)} />
          <Text>Show native input</Text>
        </Flex>
      </Card>

      {mostRowColumns ? <p>{`${mostRowColumns} columns`}</p> : null}

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
            <React.Fragment key={tableMember.key}>
              <Table>
                {tableMember.field.members.map((row, rowIndex) => {
                  if (row.kind === 'error') {
                    return (
                      <Row key={row.key}>
                        <Cell border>
                          <Feedback
                            tone="critical"
                            title="Error"
                            description="There is an error with this row"
                          />
                        </Cell>
                      </Row>
                    )
                  }

                  return (
                    <Row key={row.key}>
                      {row.item.members.length > 0 ? (
                        <>
                          {row.item.members.map((rowMember) => {
                            if (rowMember.kind === 'error') {
                              return (
                                <Cell key={rowMember.key}>
                                  <Feedback
                                    tone="critical"
                                    title="There is an error with this row member"
                                  />
                                </Cell>
                              )
                            }

                            if (rowMember.kind === 'fieldSet') {
                              return (
                                <Cell key={rowMember.key}>
                                  <Feedback tone="critical" title="UNFINISHED: Support fieldsets" />
                                </Cell>
                              )
                            }

                            if (!isMemberArrayOfObjects(rowMember)) {
                              return (
                                <Cell key={rowMember.key}>
                                  <Feedback
                                    tone="critical"
                                    title="This member is not an array of objects"
                                  />
                                </Cell>
                              )
                            }

                            return (
                              <React.Fragment key={rowMember.key}>
                                {rowMember?.field?.members?.length > 0 ? (
                                  <>
                                    {rowMember.field.members.map((cell, cellIndex) => {
                                      if (cell.kind === 'error') {
                                        return (
                                          <Cell key={cell.key}>
                                            <Feedback
                                              tone="critical"
                                              title="There is an error with this cell"
                                            />
                                          </Cell>
                                        )
                                      }

                                      if (!cell.item.members.length) {
                                        return (
                                          <Cell key={cell.key}>
                                            <Feedback tone="caution" title="Cell has no members" />
                                          </Cell>
                                        )
                                      }

                                      return (
                                        <Cell key={cell.key} paddingRight={1}>
                                          <Flex gap={1}>
                                            <Box flex={1}>
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

                                                // This is the secret sauce!!
                                                // absolutePath must be set to write edits to the correct path
                                                const CompactInput = () => (
                                                  <FormInput
                                                    {...props}
                                                    absolutePath={[
                                                      ...cell.item.path,
                                                      cellMember.name,
                                                    ]}
                                                  />
                                                )

                                                if (compact) {
                                                  return <CompactInput key={cellMember.key} />
                                                }

                                                return (
                                                  <MemberField
                                                    key={cellMember.key}
                                                    member={cellMember}
                                                    renderInput={CompactInput}
                                                    renderField={props.renderField}
                                                    renderItem={props.renderItem}
                                                    renderPreview={props.renderPreview}
                                                  />
                                                )
                                              })}
                                            </Box>

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
                                        </Cell>
                                      )
                                    })}

                                    {/* If this row has less cells than the widest row, add buttons to fill the gaps */}
                                    {/* This happens when the native array editor aggressively unsets "empty" array items */}
                                    {rowMember.field.members.length < mostRowColumns ? (
                                      <>
                                        <Cell
                                          paddingRight={1}
                                          colSpan={mostRowColumns - rowMember.field.members.length}
                                        >
                                          <Stack>
                                            <Button
                                              mode="ghost"
                                              text={
                                                mostRowColumns - rowMember.field.members.length ===
                                                1
                                                  ? `Add Cell`
                                                  : `Add Cells`
                                              }
                                              onClick={() =>
                                                handleFillRowWithCells(
                                                  row.key,
                                                  mostRowColumns - rowMember.field.members.length
                                                )
                                              }
                                            />
                                          </Stack>
                                        </Cell>
                                      </>
                                    ) : null}
                                  </>
                                ) : (
                                  <Cell paddingRight={1} colSpan={mostRowColumns}>
                                    <Stack>
                                      <Button
                                        mode="ghost"
                                        text={mostRowColumns === 1 ? `Add Cell` : `Add Cells`}
                                        onClick={() =>
                                          handleFillRowWithCells(row.key, mostRowColumns)
                                        }
                                      />
                                    </Stack>
                                  </Cell>
                                )}
                              </React.Fragment>
                            )
                          })}
                        </>
                      ) : (
                        <Feedback tone="caution" title="Row has no members" />
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
                    </Row>
                  )
                })}

                <tfoot>
                  <Row>
                    <Cell paddingTop={4} colSpan={mostRowColumns + 1}>
                      <Stack>
                        <Button
                          tone="primary"
                          text="Add row"
                          icon={AddIcon}
                          onClick={() => handleInsertRow(-1, 'after')}
                        />
                      </Stack>
                    </Cell>
                  </Row>
                </tfoot>
              </Table>

              {/* Rendered but hidden to render modals when focusPath updated */}
              <div style={{display: `none`}}>{props.renderDefault(props)}</div>
            </React.Fragment>
          )
        })
      ) : (
        <Feedback tone="caution" title="Table has no rows" />
      )}
    </Stack>
  )
}
