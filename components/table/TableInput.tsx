import React, {useEffect} from 'react'
import {useCopyToClipboard} from 'usehooks-ts'
import {Grid, Card, Stack, Button, Flex, TextInput, Text, useToast} from '@sanity/ui'
import {CheckmarkCircleIcon, CircleIcon, AddIcon} from '@sanity/icons'
import {
  FormInput,
  FormInsertPatchPosition,
  FormNodeValidation,
  insert,
  isKeyedObject,
  MemberField,
  ObjectInputProps,
  Path,
  set,
  setIfMissing,
  unset,
} from 'sanity'
import {Feedback, Cell, Row, Table} from 'sanity-plugin-utils'
import {randomKey} from '@sanity/util/content'
import {useDocumentPane} from 'sanity/desk'

import {isMemberArrayOfObjects} from './asserters'
import {getErrorLevel} from './lib/getErrorLevel'
import {CellPosition, TableValue} from './types'
import {generateEmptyCell} from './lib/generateEmptyCell'
import {generateEmptyCells} from './lib/generateEmptyCells'
import {generatePositionFromString} from './lib/generatePositionFromString'
import {getAlphabetIndex} from './lib/getAlphabetIndex'
import {consolidateRowsAndCells} from './lib/consolidateRowsAndCells'
import CellControls from './CellControls'
import RowControls from './RowControls'
import {generatePositionString} from './lib/generatePositionString'
import ColControls from './ColControls'
import TableControls from './TableControls'

export default function TableInput(props: ObjectInputProps<TableValue>) {
  const {onChange, value} = props
  const {compact = true, debug = false} = props.schemaType.options || {}
  const toast = useToast()

  const [nativeInput, setNativeInput] = React.useState(false)
  const [cellControls, setCellControls] = React.useState(false)
  const [initColumnsCount, setInitColumnsCount] = React.useState(3)
  const [initRowsCount, setInitRowsCount] = React.useState(2)

  const {onPathOpen, formState} = useDocumentPane()

  // Open modal of an object field
  const handleSetFocus = React.useCallback(
    (path: Path) => {
      onPathOpen(path)
    },
    [onPathOpen]
  )

  const [focused, setFocused] = React.useState<CellPosition | null>(null)

  // Highlight active row and column of focused input
  useEffect(() => {
    if (formState && formState.focusPath.length && formState.focusPath[0] === `table`) {
      const focusedCellPosition = formState.focusPath
        .filter(isKeyedObject)
        .find((p) => p._key)?._key

      if (!focusedCellPosition) {
        if (focused) {
          setFocused(null)
        }
      } else {
        const position = generatePositionFromString(focusedCellPosition)
        if (position.col !== focused?.col || position.row !== focused?.row) {
          setFocused(position)
        }
      }
    } else if (focused) {
      setFocused(null)
    }
  }, [formState, value, focused])

  const [copiedValue, copyToClipboard] = useCopyToClipboard()

  const handleCopyTable = React.useCallback(async () => {
    const cells = value?.cells ? value.cells : []

    if (!cells.length) {
      return
    }

    // TODO: Map over positions
    const plainTextTable = cells
      .map((c) => c.value)
      .join('\t')
      .join('\n')
    const hasCopied = await copyToClipboard(plainTextTable)
    toast.push({
      status: hasCopied ? 'success' : 'error',
      title: hasCopied ? 'Copied to clipboard' : 'Failed to copy to clipboard',
    })
  }, [toast, value, copyToClipboard])

  const handlePasteTable = React.useCallback(async () => {
    try {
      const permission = await navigator.permissions.query({
        // @ts-expect-error
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
      const newTable = generateEmptyCells({
        rows: rowsCount,
        cols: columnsCount,
      })
      onChange(set(newTable, ['cells']))
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
        generateEmptyCells(clickedOrLastRow?.cells?.length ? clickedOrLastRow.cells.length : 1),
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
      const {cells: newCells} = generateEmptyCells(count)
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
  const {lastRowNumber, lastColNumber} = React.useMemo(
    () =>
      value?.cells?.reduce(
        (acc, cell) => {
          const position = generatePositionFromString(cell._key)

          const rowIsHigher = position.row > acc.lastRow
          const colIsHigher = position.col > acc.lastCol

          return {
            lastRow: rowIsHigher ? position.row : acc.lastRow,
            lastRowNumber: rowIsHigher ? acc.lastRowNumber + 1 : acc.lastRowNumber,
            lastCol: colIsHigher ? position.col : acc.lastCol,
            lastColNumber: colIsHigher ? acc.lastColNumber + 1 : acc.lastColNumber,
          }
        },
        {
          lastRow: '',
          lastRowNumber: 0,
          lastCol: '',
          lastColNumber: 0,
        }
      ) ?? {
        lastRow: '',
        lastRowNumber: 0,
        lastCol: '',
        lastColNumber: 0,
      },
    [value?.cells]
  )

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
                title="UNFINISHED: Handle fieldsets"
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

          // Take the flat array of cells and create an array for each row, populated with each column
          const consolidatedRowsAndCells = consolidateRowsAndCells(tableMember.field.members)

          return (
            <React.Fragment key={tableMember.key}>
              <Table>
                {lastColNumber > 0 ? (
                  <ColControls
                    count={lastColNumber}
                    focused={focused}
                    firstRow={consolidatedRowsAndCells[0]}
                  >
                    <TableControls />
                  </ColControls>
                ) : null}

                <tbody>
                  {consolidatedRowsAndCells.map((row, rowIndex) => {
                    if (!row.length) {
                      return null
                    }

                    const firstCellPosition = generatePositionFromString(row[0].item.value._key)
                    const rowIsFocused = focused && focused.row === firstCellPosition.row
                    const rowIsLast = rowIndex === lastRowNumber - 1
                    const rowIsFirst = rowIndex === 0

                    return (
                      <Row key={rowIndex}>
                        {row.map((cell, cellIndex) => {
                          const position = generatePositionFromString(cell.item.value._key)

                          const allValidations = cell.item.members.reduce((acc, cellMember) => {
                            if (cellMember.kind === 'field') {
                              return [...acc, ...cellMember.field.validation]
                            }
                            return acc
                          }, [] as FormNodeValidation[])
                          const errorLevel = getErrorLevel(allValidations)

                          return (
                            <Cell
                              key={cell.key}
                              padding={0.5}
                              tone={errorLevel ?? undefined}
                              colSpan={position.colSpan > 1 ? position.colSpan : undefined}
                              rowSpan={position.rowSpan > 1 ? position.rowSpan : undefined}
                            >
                              {/* Render each individual field */}
                              {cell.item.members.map((member) => {
                                // TODO: Handle errors
                                if (member.kind === 'error' || member.kind === 'fieldSet') {
                                  return null
                                }

                                if (member.name === 'position') {
                                  return null
                                }

                                return (
                                  <Stack key={member.key} space={1}>
                                    {compact ? (
                                      <FormInput
                                        {...props}
                                        // This is the secret sauce!!
                                        // absolutePath must be set to write edits to the correct path
                                        absolutePath={member.field.path}
                                      />
                                    ) : (
                                      <MemberField
                                        member={member}
                                        renderInput={() => (
                                          <FormInput {...props} absolutePath={member.field.path} />
                                        )}
                                        renderField={props.renderField}
                                        renderItem={props.renderItem}
                                        renderPreview={props.renderPreview}
                                      />
                                    )}
                                    {cellControls ? <CellControls /> : null}
                                  </Stack>
                                )
                              })}
                            </Cell>
                          )
                        })}
                        <RowControls
                          isFocused={Boolean(rowIsFocused)}
                          rowIndex={rowIndex + 1}
                          rowIsLast={rowIsLast}
                          rowIsFirst={rowIsFirst}
                        />
                      </Row>
                    )

                    //                   {/* If this row has less cells than the widest row, add buttons to fill the gaps */}
                    //                   {/* This happens when the native array editor aggressively unsets "empty" array items */}
                    //                   {rowColumnsCount < lastCol ? (
                    //                     <Cell colSpan={lastCol - rowColumnsCount}>
                    //                       <Stack>
                    //                         <Button
                    //                           mode="ghost"
                    //                           text={
                    //                             lastCol - rowColumnsCount === 1
                    //                               ? `Add Cell`
                    //                               : `Add Cells`
                    //                           }
                    //                           onClick={() =>
                    //                             handleFillRowWithCells(
                    //                               row.key,
                    //                               lastCol - rowColumnsCount
                    //                             )
                    //                           }
                    //                         />
                    //                       </Stack>
                    //                     </Cell>
                    //                   ) : null}
                    //                 </>
                    //               ) : (
                    //                 <Cell colSpan={lastCol}>
                    //                   <Stack>
                    //                     <Button
                    //                       mode="ghost"
                    //                       text={lastCol === 1 ? `Add cell` : `Add cells`}
                    //                       onClick={() => handleFillRowWithCells(row.key, lastCol)}
                    //                     />
                    //                   </Stack>
                    //                 </Cell>
                    //               )}
                    //             </React.Fragment>
                    //           )
                    //         })}
                    //       </>
                    //     ) : (
                    //       <Feedback tone="caution" title="Row has no members" />
                    //     )}
                  })}
                </tbody>

                <tfoot>
                  <Row>
                    <Cell paddingTop={3} colSpan={lastColNumber + 1}>
                      <Stack>
                        {value && value?.cells?.length > 0 ? (
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
