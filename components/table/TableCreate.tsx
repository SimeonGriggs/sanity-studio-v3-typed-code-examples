import React from 'react'
import {Stack, Grid, Button} from '@sanity/ui'

import {generateEmptyCells} from './lib/generateEmptyCells'
import {set} from 'sanity'

const DEFAULT_ROW_COUNT = 5
const DEFAULT_COL_COUNT = 7

const rowCount = Array.from({length: DEFAULT_ROW_COUNT}, (_, i) => i + 1)
const colCount = Array.from({length: DEFAULT_COL_COUNT}, (_, i) => i + 1)

type TableCreateProps = {
  onChange: (value: any) => void
}

export default function TableCreate(props: TableCreateProps) {
  const {onChange} = props

  const [rows, setRows] = React.useState(0)
  const [cols, setCols] = React.useState(0)

  const handleInsertTable = React.useCallback(() => {
    const newTable = generateEmptyCells({
      rows: rows ?? DEFAULT_ROW_COUNT,
      cols: cols ?? DEFAULT_COL_COUNT,
    })
    onChange(set(newTable, ['cells']))
  }, [cols, onChange, rows])

  return (
    <Stack
      space={1}
      onMouseLeave={() => {
        setRows(0)
        setCols(0)
      }}
    >
      {rowCount.map((_, i) => (
        <Grid columns={colCount.length} key={i} gap={1}>
          {colCount.map((_, j) => (
            <Button
              key={j}
              mode={i + 1 <= rows && j + 1 <= cols ? 'default' : 'ghost'}
              tone="primary"
              onMouseEnter={() => {
                setRows(i + 1)
                setCols(j + 1)
              }}
              onClick={handleInsertTable}
              style={{aspectRatio: `16/9`}}
            ></Button>
          ))}
        </Grid>
      ))}
      <Button text={rows && cols ? `Create ${cols}x${rows} table` : `Create table`} mode="ghost" />
    </Stack>
  )
}
