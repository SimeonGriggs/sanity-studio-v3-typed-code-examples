import {LexoDecimal, LexoRank} from 'lexorank'
import {CellValue} from '../types'
import {generateEmptyCell} from './generateEmptyCell'
import {generatePositionString} from './generatePositionString'

export function generateEmptyCells({rows, cols}: {rows: number; cols: number}): CellValue[] {
  const cellCount = rows * cols
  const cells = [...Array(cellCount)].map(() => generateEmptyCell())
  let rowLexo = LexoRank.min()
  let colLexo = LexoRank.min()
  let newRow = true

  for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    if (newRow) {
      rowLexo = LexoRank.parse(rowLexo.toString()).genNext().genNext()
      colLexo = LexoRank.min()
      newRow = false
    } else {
      colLexo = LexoRank.parse(colLexo.toString()).genNext().genNext()
    }

    if (cellIndex % cols === cols - 1) {
      newRow = true
    }

    cells[cellIndex]._key = generatePositionString({
      col: colLexo.toString(),
      colSpan: 1,
      row: rowLexo.toString(),
      rowSpan: 1,
    })

    cells[cellIndex].value = `${cellIndex}`
  }

  return cells
}
