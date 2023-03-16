import React from 'react'
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
} from '@sanity/ui'
import {
  TrashIcon,
  CheckmarkCircleIcon,
  CircleIcon,
  ResetIcon,
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
  }

  if (validation.find((v) => v.level === 'error')) {
    return 'critical'
  }

  if (validation.find((v) => v.level === 'warning')) {
    return 'caution'
  }

  if (validation.find((v) => v.level === 'warning')) {
    return 'default'
  }

  return null
}

export default function TableInput(props: ObjectInputProps<TableValue>) {
  const {onChange, focusPath, value} = props
  const {compact = true, debug = false} = props.schemaType.options || {}
  console.log(props.focusPath)

  const [nativeInput, setNativeInput] = React.useState(false)
  const [cellControls, setCellControls] = React.useState(false)
  const [rowControls, setRowControls] = React.useState(true)
  const [initColumnsCount, setInitColumnsCount] = React.useState(1)
  const [initRowsCount, setInitRowsCount] = React.useState(1)

  const pane = useDocumentPane()

  const handleSetFocus = React.useCallback(
    (path: Path) => {
      console.log(`shouldFocus`, path)
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

  const focusedMember = React.useMemo(() => {
    // There should only be one
    const tableFieldMembers = props.members.find((member) => member.kind === 'field') as FieldMember

    if (!isMemberArrayOfObjects(tableFieldMembers)) {
      return null
    }

    const rowMembers = tableFieldMembers.field.members

    console.log(`rowMembers`, rowMembers)
  }, [props.members])
  console.log(focusedMember)

  return (
    <Stack space={debug ? 3 : 0}>
      {JSON.stringify(focusPath)}

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
                <tbody>
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
                                                        icon={ChevronLeftIcon}
                                                        text="Insert column before"
                                                        tone="primary"
                                                        onClick={() =>
                                                          handleInsertColumn(cellIndex, 'before')
                                                        }
                                                      />
                                                      <MenuItem
                                                        iconRight={ChevronRightIcon}
                                                        text="Insert column after"
                                                        tone="primary"
                                                        onClick={() =>
                                                          handleInsertColumn(cellIndex, 'after')
                                                        }
                                                      />
                                                      <MenuDivider />
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
                                                      <MenuDivider />
                                                      <MenuItem
                                                        icon={TrashIcon}
                                                        text="Remove column"
                                                        tone="critical"
                                                        onClick={() =>
                                                          handleRemoveColumn(cellIndex)
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
                        {rowControls ? (
                          <Cell paddingLeft={2}>
                            <MenuButton
                              button={<Button mode="ghost" icon={EllipsisVerticalIcon} />}
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
                        ) : null}
                      </Row>
                    )
                  })}
                </tbody>

                <tfoot>
                  <Row>
                    <Cell
                      paddingTop={3}
                      colSpan={rowControls ? mostRowColumns + 1 : mostRowColumns}
                    >
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
                {/* {props.renderDefault(props)} */}
                {/* {props.focusPath.length ? props.renderDefault(props) : null} */}
              </div>
              {/* {props.focusPath.length ? (
                <MemberField
                  // member={cellMember}
                  renderInput={props.renderInput}
                  renderField={props.renderField}
                  renderItem={props.renderItem}
                  renderPreview={props.renderPreview}
                />
              ) : null} */}
            </React.Fragment>
          )
        })
      ) : (
        <Feedback tone="caution" title="Table has no rows" />
      )}

      {debug ? (
        <Card>
          <Grid gap={3} columns={3}>
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
            <Button
              fontSize={1}
              padding={3}
              tone={rowControls ? `positive` : `default`}
              mode={rowControls ? `default` : `ghost`}
              icon={rowControls ? CheckmarkCircleIcon : CircleIcon}
              onClick={() => setRowControls(!rowControls)}
              text="Row controls"
            />
          </Grid>
        </Card>
      ) : null}
    </Stack>
  )
}
