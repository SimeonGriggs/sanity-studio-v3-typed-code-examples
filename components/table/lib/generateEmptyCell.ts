import {randomKey} from '@sanity/util/content'

import {CellValue} from '../types'

export function generateEmptyCell(): CellValue {
  return {
    // This MUST be overwritten by the caller
    _key: randomKey(12),
    _type: 'cell',
  }
}
