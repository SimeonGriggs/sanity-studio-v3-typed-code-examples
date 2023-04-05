import {CellPosition} from '../types'

export function generatePositionFromString(position: string): CellPosition {
  const [rowCol, rowSpanColSpan] = position.split('|||')
  const [row, col] = rowCol.split('===')
  const [rowSpan, colSpan] = rowSpanColSpan.split('===').map((n) => parseInt(n, 10))

  return {
    row,
    rowSpan,
    col,
    colSpan,
  }
}
