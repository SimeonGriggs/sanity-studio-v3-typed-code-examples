import {
  ArrayOfObjectsItemMember,
  ArrayOfObjectsMember,
  ObjectArrayFormNode,
  ObjectSchemaType,
} from 'sanity'

import {LooseCellValue} from '../types'
import {generatePositionFromString} from './generatePositionFromString'

type MemberGroup = {
  rowKey: string
  cells: ArrayOfObjectsItemMember<ObjectArrayFormNode<LooseCellValue, ObjectSchemaType>>[]
}

export function consolidateRowsAndCells(
  members: ArrayOfObjectsMember[]
): ArrayOfObjectsItemMember<ObjectArrayFormNode<LooseCellValue, ObjectSchemaType>>[][] {
  const membersGrouped = members.reduce<MemberGroup[]>((acc, cellMember) => {
    if (cellMember.kind === 'error') {
      return acc
    }

    const position = generatePositionFromString(cellMember.item.value._key)
    const rowIndex = acc.findIndex((row) => row.rowKey === position.row)

    if (rowIndex < 0) {
      acc.push({
        rowKey: position.row,
        cells: [cellMember],
      })
    } else if (rowIndex > -1) {
      acc[rowIndex].cells.push(cellMember)
    }

    return acc
  }, [])

  const membersSorted = membersGrouped.map((row) => {
    return row.cells.sort((a, b) => {
      const aPosition = generatePositionFromString(a.item.value._key)
      const bPosition = generatePositionFromString(b.item.value._key)

      return aPosition.col.localeCompare(bPosition.col)
    })
  })

  return membersSorted
}
