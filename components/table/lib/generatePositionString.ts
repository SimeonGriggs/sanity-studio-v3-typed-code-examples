import {CellPosition} from '../types'

/**
 * Cell position looks like
 * rowLexoRankString===colLexoRankString|||rowSpanNumber===colSpanNumber
 * @param param0
 * @returns
 */
export function generatePositionString({col, colSpan, row, rowSpan}: CellPosition): string {
  return [[row, col].join('==='), [rowSpan, colSpan].join('===')].join('|||')
}
