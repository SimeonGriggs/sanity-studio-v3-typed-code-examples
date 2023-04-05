import {KeyedObject} from 'sanity'

// Added to silence TS errors
/**
 * @internal
 */
export type LooseCellValue = KeyedObject & {
  _type?: string
  value?: string
}

export type CellValue = KeyedObject & {
  _type: 'cell'
  value?: string
}

export type TableValue = KeyedObject & {
  _type: 'table'
  cells: CellValue[]
}

export type CellPosition = {
  col: string
  colSpan: number
  row: string
  rowSpan: number
}
