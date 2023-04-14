import React from 'react'
import {Button, MenuButton, Menu, MenuItem, MenuDivider} from '@sanity/ui'
import {ResetIcon, EllipsisVerticalIcon, EyeOpenIcon, RemoveCircleIcon} from '@sanity/icons'
import {useDocumentPane} from 'sanity/desk'
import {Path} from 'sanity'

export default function CellControls() {
  const row = {key: 'asdf'}

  const {onPathOpen} = useDocumentPane()

  // Open modal of an object field
  const handleSetFocus = React.useCallback(
    (path: Path) => {
      onPathOpen(path)
    },
    [onPathOpen]
  )

  return (
    <MenuButton
      button={<Button mode="ghost" icon={EllipsisVerticalIcon} />}
      id={`table-column-menu-${row.key}`}
      menu={
        <Menu>
          <MenuItem
            text="Open cell"
            icon={EyeOpenIcon}
            tone="primary"
            // onClick={() => handleSetFocus(cell.item.path)}
          />
          <MenuDivider />
          <MenuItem
            icon={ResetIcon}
            text="Reset cell"
            tone="critical"
            // onClick={() => handleResetCell(cell.item.path)}
          />
          <MenuItem
            icon={RemoveCircleIcon}
            text="Remove cell"
            tone="critical"
            // onClick={() => handleRemoveCell(cell.item.path)}
          />
        </Menu>
      }
      popover={{portal: true}}
    />
  )
}
