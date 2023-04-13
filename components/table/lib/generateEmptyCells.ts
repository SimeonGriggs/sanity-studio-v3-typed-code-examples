import {LexoRank} from 'lexorank'
import {CellValue} from '../types'
import {generateEmptyCell} from './generateEmptyCell'
import {generatePositionString} from './generatePositionString'
import {generateMultipleOrderRanks} from './generateMultipleOrderRanks'

type EmptyCellsConfig = {
  rows: number
  rowMinOrder?: string
  rowMaxOrder?: string
  cols: number
  colMinOrder?: string
  colMaxOrder?: string
}

export function generateEmptyCells(config: EmptyCellsConfig): CellValue[] {
  const {rows, cols} = config

  const rowMinOrder = config.rowMinOrder ? LexoRank.parse(config.rowMinOrder) : undefined
  const rowMaxOrder = config.rowMaxOrder ? LexoRank.parse(config.rowMaxOrder) : undefined
  const colMinOrder = config.colMinOrder ? LexoRank.parse(config.colMinOrder) : undefined
  const colMaxOrder = config.colMaxOrder ? LexoRank.parse(config.colMaxOrder) : undefined

  const cellCount = rows * cols
  const rowRanks = generateMultipleOrderRanks(rows, rowMinOrder, rowMaxOrder)
  const colRanks = generateMultipleOrderRanks(cols, colMinOrder, colMaxOrder)

  let rowIndex = 0
  let colIndex = 0

  const cells = [...Array(cellCount)].map(() => generateEmptyCell())

  for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const rowLexo = rowRanks[rowIndex]
    const colLexo = colRanks[colIndex]

    cells[cellIndex]._key = generatePositionString({
      col: colLexo.toString(),
      colSpan: 1,
      row: rowLexo.toString(),
      rowSpan: 1,
    })

    colIndex++
    if (colIndex >= cols) {
      rowIndex++
      colIndex = 0
    }

    // TODO: Debugging only
    cells[cellIndex].value = `${cellIndex}`
  }

  // Re-sort for good measure
  cells.sort((a, b) => a._key.localeCompare(b._key))

  return cells
}
