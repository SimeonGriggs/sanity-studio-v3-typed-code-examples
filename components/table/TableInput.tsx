import React, {useEffect} from 'react'
import {useCopyToClipboard} from 'usehooks-ts'
import {
  Grid,
  Card,
  Stack,
  Button,
  Flex,
  MenuButton,
  Menu,
  MenuItem,
  MenuDivider,
  CardTone,
  TextInput,
  Text,
  useToast,
} from '@sanity/ui'
import {
  TrashIcon,
  CheckmarkCircleIcon,
  CircleIcon,
  ResetIcon,
  EllipsisVerticalIcon,
  CopyIcon,
  ClipboardIcon,
  EyeOpenIcon,
  AddIcon,
  RemoveCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  InsertAboveIcon,
  InsertBelowIcon,
} from '@sanity/icons'
import {
  FieldMember,
  FormInput,
  FormInsertPatchPosition,
  FormNodeValidation,
  insert,
  KeyedObject,
  MemberField,
  ObjectInputProps,
  Path,
  set,
  setIfMissing,
  unset,
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

function getAlphabetIndex(index: number): string {
  return String.fromCharCode(65 + index)
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

function getErrorLevel(validation: FormNodeValidation[] = []): CardTone | null {
  if (!validation.length) {
    return null
  } else if (validation.find((v) => v.level === 'error')) {
    return 'critical'
  } else if (validation.find((v) => v.level === 'warning')) {
    return 'caution'
  } else if (validation.find((v) => v.level === 'info')) {
    return 'default'
  }

  return null
}

export default function TableInput(props: ObjectInputProps<TableValue>) {
  const {onChange, members, value} = props
  const {compact = true, debug = false} = props.schemaType.options || {}
  const toast = useToast()

  const [nativeInput, setNativeInput] = React.useState(false)
  const [cellControls, setCellControls] = React.useState(false)
  const [initColumnsCount, setInitColumnsCount] = React.useState(1)
  const [initRowsCount, setInitRowsCount] = React.useState(1)

  const {onPathOpen, formState} = useDocumentPane()

  // Open modal of an object field
  const handleSetFocus = React.useCallback(
    (path: Path) => {
      onPathOpen(path)
    },
    [onPathOpen]
  )

  const [focused, setFocused] = React.useState<{
    row: number | null
    column: number | null
  }>({row: null, column: null})

  // Highlight active row and column of focused input
  useEffect(() => {
    if (formState && formState.focusPath.length && formState.focusPath[0] === `table`) {
      const [rowKey, cellKey] = formState.focusPath.reduce<string[]>((acc, cur) => {
        if (typeof cur !== 'string' && typeof cur !== 'number' && '_key' in cur) {
          return [...acc, cur._key]
        }

        return acc
      }, [])

      if (
        (!rowKey || !cellKey) &&
        (typeof focused.row === 'number' || typeof focused.column === 'number')
      ) {
        // setFocused({row: null, column: null})
      } else {
        const rowIndex = value?.rows?.findIndex((r) => r._key === rowKey)
        const columnIndex =
          typeof rowIndex === 'number'
            ? value?.rows?.[rowIndex]?.cells?.findIndex((c) => c._key === cellKey)
            : null

        if (
          typeof rowIndex === 'number' &&
          typeof columnIndex === 'number' &&
          (rowIndex !== focused.row || columnIndex !== focused.column)
        ) {
          setFocused({row: rowIndex, column: columnIndex})
        } else {
          // setFocused({row: null, column: null})
        }
      }
    } else if (
      formState &&
      !formState.focusPath.length &&
      (typeof focused.row === 'number' || typeof focused.column === 'number')
    ) {
      setFocused({row: null, column: null})
    }
  }, [formState, value, focused])

  const [copiedValue, copyToClipboard] = useCopyToClipboard()

  const handleCopyTable = React.useCallback(async () => {
    const {rows = []} = value ?? {}
    if (!rows.length) {
      return
    }

    const plainTextTable = rows.map((r) => r.cells.map((c) => c.value).join('\t')).join('\n')
    const hasCopied = await copyToClipboard(plainTextTable)
    toast.push({
      status: hasCopied ? 'success' : 'error',
      title: hasCopied ? 'Copied to clipboard' : 'Failed to copy to clipboard',
    })
  }, [toast, value, copyToClipboard])

  const handlePasteTable = React.useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({
        name: 'clipboard-read',
      })
      if (permission.state === 'denied') {
        throw new Error('Not allowed to read clipboard.')
      }
      const clipboardText = await navigator.clipboard.readText()

      if (clipboardText) {
        const pasteTable = clipboardText
          .split('\n')
          // don't create empty rows
          .filter(Boolean)
          .map((row) => {
            return {
              _key: randomKey(12),
              _type: 'row',
              cells: row
                .split('\t')
                // some cells might be empty
                // .filter(Boolean)
                .map((cell) => {
                  return {
                    _key: randomKey(12),
                    _type: 'cell',
                    value: cell,
                  }
                }),
            }
          })

        onChange([setIfMissing([], ['rows']), insert(pasteTable, 'after', ['rows', -1])])
      } else {
        toast.push({
          status: 'warning',
          title: 'Clipboard is empty',
        })
      }
    } catch (error) {
      console.error(error.message)
    }
  }, [onChange, toast])

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

  const handleInsertTable = React.useCallback(
    (columnsCount: number, rowsCount: number) => {
      const newTable = [...Array(rowsCount)].map(() => generateEmptyRow(columnsCount))
      onChange(set(newTable, ['rows']))
    },
    [onChange]
  )

  const handleInsertRow = React.useCallback(
    (index: number, position: FormInsertPatchPosition) => {
      const {rows = []} = value || {}
      const clickedOrLastRow =
        index < 0 && rows?.length
          ? rows[index < 0 && rows.length ? rows.length - 1 : index]
          : rows[index]
      const newRow = [
        generateEmptyRow(clickedOrLastRow?.cells?.length ? clickedOrLastRow.cells.length : 1),
      ]
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

  const handleDuplicateColumn = React.useCallback(
    (index: number) => {
      const {rows = []} = value || {}
      const clickedColumnCells = rows.map((r) => r.cells[index])

      const patches = clickedColumnCells.map((cell, rowIndex) => {
        const newCell = {
          ...cell,
          _key: randomKey(12),
        }
        return insert([newCell], 'after', ['rows', rowIndex, 'cells', index])
      })
      onChange(patches)
    },
    [onChange, value]
  )

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

  const handleResetCell = React.useCallback(
    (path: Path) => {
      const newCell = generateEmptyCell()
      onChange([unset(path), set(newCell, path.slice(1))])
    },
    [onChange]
  )

  const handleRemoveCell = React.useCallback(
    (path: Path) => {
      onChange(unset(path.slice(1)))
    },
    [onChange]
  )

  // Calculate the most number of columns in any row
  const mostRowColumns =
    value?.rows?.reduce((acc, row) => {
      return row?.cells?.length > acc ? row.cells.length : acc
    }, 0) ?? 0

  return (
    <Stack space={debug ? 3 : 0}>
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
                {mostRowColumns > 0 ? (
                  <thead>
                    <Row>
                      {[...Array(mostRowColumns)].map((_, cellIndex) => (
                        <Cell key={cellIndex} padding={0.5} paddingBottom={2}>
                          <MenuButton
                            button={
                              <Stack>
                                <Button
                                  tone="primary"
                                  mode={
                                    typeof focused.column === 'number' &&
                                    focused.column === cellIndex
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  paddingY={2}
                                  style={{
                                    borderRadius:
                                      cellIndex === 0
                                        ? '3px 0 0 3px'
                                        : cellIndex === mostRowColumns - 1
                                        ? '0 3px 3px 0'
                                        : 0,
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
                                  onClick={() => handleDuplicateColumn(cellIndex)}
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
                      ))}
                      <Cell paddingLeft={2} paddingBottom={2}>
                        <MenuButton
                          button={
                            <Stack>
                              <Button
                                tone="primary"
                                mode="ghost"
                                paddingY={2}
                                textAlign="center"
                                icon={EllipsisVerticalIcon}
                                // style={{width: `100%`}}
                              />
                            </Stack>
                          }
                          id={`table-context-menu`}
                          menu={
                            <Menu>
                              <MenuItem
                                icon={CopyIcon}
                                text="Copy table"
                                onClick={handleCopyTable}
                              />
                              <MenuItem
                                icon={ClipboardIcon}
                                text="Paste table"
                                onClick={handlePasteTable}
                              />
                              <MenuDivider />
                              <MenuItem
                                icon={TrashIcon}
                                text="Expand"
                                // onClick={() => handleRemoveColumn(cellIndex)}
                              />
                            </Menu>
                          }
                          popover={{portal: true}}
                        />
                      </Cell>
                    </Row>
                  </thead>
                ) : null}

                <tbody>
                  {tableMember.field.members.map((row, rowIndex) => {
                    if (row.kind === 'error') {
                      return (
                        <Row key={row.key}>
                          <Cell>
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
                                    <Feedback
                                      tone="critical"
                                      title="UNFINISHED: Support fieldsets"
                                    />
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

                              const rowValue = rowMember.field.value as CellValue[]
                              const rowColumnsCount =
                                rowValue?.reduce((acc: number, cur: CellValue) => {
                                  if (typeof cur.colSpan === 'number') {
                                    return acc + cur.colSpan
                                  }

                                  return acc + 1
                                }, 0 as number) ?? 0

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
                                              <Feedback
                                                tone="caution"
                                                title="Cell has no members"
                                              />
                                            </Cell>
                                          )
                                        }

                                        const allValidations = cell.item.members.reduce(
                                          (acc, cellMember) => {
                                            if (cellMember.kind === 'field') {
                                              return [...acc, ...cellMember.field.validation]
                                            }
                                            return acc
                                          },
                                          [] as FormNodeValidation[]
                                        )

                                        const errorLevel = getErrorLevel(allValidations)
                                        const {colSpan, rowSpan} = cell.item.value as CellValue

                                        return (
                                          <Cell
                                            key={cell.key}
                                            colSpan={
                                              typeof colSpan === 'number' ? colSpan : undefined
                                            }
                                            padding={0.5}
                                            tone={errorLevel ?? undefined}
                                          >
                                            <Flex gap={1} align="center">
                                              <Stack space={1} flex={1}>
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
                                                        // This is the secret sauce!!
                                                        // absolutePath must be set to write edits to the correct path
                                                        absolutePath={cellMember.field.path}
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
                                                          absolutePath={cellMember.field.path}
                                                        />
                                                      )}
                                                      renderField={props.renderField}
                                                      renderItem={props.renderItem}
                                                      renderPreview={props.renderPreview}
                                                    />
                                                  )
                                                })}
                                              </Stack>

                                              {cellControls ? (
                                                <MenuButton
                                                  button={
                                                    <Button
                                                      mode="ghost"
                                                      icon={EllipsisVerticalIcon}
                                                    />
                                                  }
                                                  id={`table-column-menu-${row.key}`}
                                                  menu={
                                                    <Menu>
                                                      <MenuItem
                                                        text="Open cell"
                                                        icon={EyeOpenIcon}
                                                        tone="primary"
                                                        onClick={() =>
                                                          handleSetFocus(cell.item.path)
                                                        }
                                                      />
                                                      <MenuDivider />
                                                      <MenuItem
                                                        icon={ResetIcon}
                                                        text="Reset cell"
                                                        tone="critical"
                                                        onClick={() =>
                                                          handleResetCell(cell.item.path)
                                                        }
                                                      />
                                                      <MenuItem
                                                        icon={RemoveCircleIcon}
                                                        text="Remove cell"
                                                        tone="critical"
                                                        onClick={() =>
                                                          handleRemoveCell(cell.item.path)
                                                        }
                                                      />
                                                    </Menu>
                                                  }
                                                  popover={{portal: true}}
                                                />
                                              ) : null}
                                            </Flex>
                                          </Cell>
                                        )
                                      })}

                                      {/* If this row has less cells than the widest row, add buttons to fill the gaps */}
                                      {/* This happens when the native array editor aggressively unsets "empty" array items */}
                                      {rowColumnsCount < mostRowColumns ? (
                                        <Cell colSpan={mostRowColumns - rowColumnsCount}>
                                          <Stack>
                                            <Button
                                              mode="ghost"
                                              text={
                                                mostRowColumns - rowColumnsCount === 1
                                                  ? `Add Cell`
                                                  : `Add Cells`
                                              }
                                              onClick={() =>
                                                handleFillRowWithCells(
                                                  row.key,
                                                  mostRowColumns - rowColumnsCount
                                                )
                                              }
                                            />
                                          </Stack>
                                        </Cell>
                                      ) : null}
                                    </>
                                  ) : (
                                    <Cell colSpan={mostRowColumns}>
                                      <Stack>
                                        <Button
                                          mode="ghost"
                                          text={mostRowColumns === 1 ? `Add cell` : `Add cells`}
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

                        <Cell padding={0.5} paddingLeft={2}>
                          <MenuButton
                            button={
                              <Button
                                mode={
                                  typeof focused.row === 'number' && focused.row === rowIndex
                                    ? 'default'
                                    : 'ghost'
                                }
                                tone="primary"
                                radius={0}
                                style={{
                                  borderRadius:
                                    rowIndex === 0
                                      ? '3px 3px 0 0'
                                      : value && value?.rows?.length - 1 === rowIndex
                                      ? '0 0 3px 3px'
                                      : 0,
                                  width: `100%`,
                                }}
                                text={rowIndex + 1}
                              />
                            }
                            id={`table-row-menu-${row.key}`}
                            menu={
                              <Menu>
                                <MenuItem
                                  icon={InsertAboveIcon}
                                  text="Insert row before"
                                  onClick={() => handleInsertRow(rowIndex, 'before')}
                                />
                                <MenuItem
                                  icon={InsertBelowIcon}
                                  text="Insert row after"
                                  onClick={() => handleInsertRow(rowIndex, 'after')}
                                />
                                <MenuItem
                                  icon={CopyIcon}
                                  text="Duplicate row"
                                  onClick={() => handleDuplicateRow(rowIndex)}
                                />
                                <MenuDivider />
                                <MenuItem
                                  icon={EyeOpenIcon}
                                  tone="primary"
                                  text="Open row"
                                  onClick={() => handleSetFocus(row.item.path)}
                                />
                                <MenuDivider />
                                <MenuItem
                                  icon={TrashIcon}
                                  tone="critical"
                                  text="Remove row"
                                  onClick={() => handleRemoveRow(row.key)}
                                />
                              </Menu>
                            }
                            popover={{portal: true}}
                          />
                        </Cell>
                      </Row>
                    )
                  })}
                </tbody>

                <tfoot>
                  <Row>
                    <Cell paddingTop={3} colSpan={mostRowColumns + 1}>
                      <Stack>
                        {value && value?.rows?.length > 0 ? (
                          <Button
                            mode="ghost"
                            text="Add row"
                            icon={AddIcon}
                            onClick={() => handleInsertRow(-1, 'after')}
                          />
                        ) : (
                          <Flex gap={3} align="flex-end">
                            <Stack space={2}>
                              <Text weight="medium" size={1}>
                                Columns
                              </Text>
                              <TextInput
                                value={initColumnsCount}
                                type="number"
                                onChange={(e) =>
                                  parseInt(e.target.value, 10) > 0
                                    ? setInitColumnsCount(parseInt(e.target.value, 10))
                                    : null
                                }
                              />
                            </Stack>
                            <Stack space={2}>
                              <Text weight="medium" size={1}>
                                Columns
                              </Text>
                              <TextInput
                                value={initRowsCount}
                                type="number"
                                onChange={(e) =>
                                  parseInt(e.target.value, 10) > 0
                                    ? setInitRowsCount(parseInt(e.target.value, 10))
                                    : null
                                }
                              />
                            </Stack>
                            <Button
                              mode="ghost"
                              text={`Create ${initColumnsCount} × ${initRowsCount} table`}
                              icon={AddIcon}
                              disabled={initColumnsCount < 1 || initRowsCount < 1}
                              onClick={() => handleInsertTable(initColumnsCount, initRowsCount)}
                            />
                          </Flex>
                        )}
                      </Stack>
                    </Cell>
                  </Row>
                </tfoot>
              </Table>

              {/* Rendered but hidden to render modals when focusPath updated */}
              <div style={{display: `none`}}>
                {props.renderDefault(props)}
                {/* {props.focusPath.length ? props.renderDefault(props) : null} */}
              </div>
            </React.Fragment>
          )
        })
      ) : (
        <Feedback tone="caution" title="Table has no rows" />
      )}

      {debug ? (
        <Card>
          <Grid gap={3} columns={2}>
            <Button
              fontSize={1}
              padding={3}
              tone={nativeInput ? `positive` : `default`}
              mode={nativeInput ? `default` : `ghost`}
              icon={nativeInput ? CheckmarkCircleIcon : CircleIcon}
              onClick={() => setNativeInput(!nativeInput)}
              text="Use native input"
            />
            <Button
              fontSize={1}
              padding={3}
              tone={cellControls ? `positive` : `default`}
              mode={cellControls ? `default` : `ghost`}
              icon={cellControls ? CheckmarkCircleIcon : CircleIcon}
              onClick={() => setCellControls(!cellControls)}
              text="Cell controls"
            />
          </Grid>
        </Card>
      ) : null}
    </Stack>
  )
}
