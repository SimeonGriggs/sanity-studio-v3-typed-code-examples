import {Button, MenuButton, Menu, MenuItem, MenuDivider} from '@sanity/ui'
import {TrashIcon, CopyIcon, InsertAboveIcon, InsertBelowIcon, EyeOpenIcon} from '@sanity/icons'
import {Cell} from 'sanity-plugin-utils'

type RowControlsProps = {
  isFocused: boolean
  rowIsLast: boolean
  rowIsFirst: boolean
  rowIndex: number
}

export default function RowControls(props: RowControlsProps) {
  const {isFocused = false, rowIsLast, rowIsFirst, rowIndex} = props

  const row = {key: 'asdf'}

  return (
    <Cell padding={0.5} paddingLeft={2}>
      <MenuButton
        button={
          <Button
            mode={isFocused ? 'default' : 'ghost'}
            tone="primary"
            radius={0}
            style={{
              borderRadius: rowIsFirst ? '3px 3px 0 0' : rowIsLast ? '0 0 3px 3px' : 0,
              width: `100%`,
            }}
            text={rowIndex.toString()}
          />
        }
        id={`table-row-menu-${row.key}`}
        menu={
          <Menu>
            <MenuItem
              icon={InsertAboveIcon}
              text="Insert row before"
              //   onClick={() => handleInsertRow(rowIndex, 'before')}
            />
            <MenuItem
              icon={InsertBelowIcon}
              text="Insert row after"
              //   onClick={() => handleInsertRow(rowIndex, 'after')}
            />
            <MenuItem
              icon={CopyIcon}
              text="Duplicate row"
              //   onClick={() => handleDuplicateRow(rowIndex)}
            />
            <MenuDivider />
            <MenuItem
              icon={EyeOpenIcon}
              tone="primary"
              text="Open row"
              //   onClick={() => handleSetFocus(row.item.path)}
            />
            <MenuDivider />
            <MenuItem
              icon={TrashIcon}
              tone="critical"
              text="Remove row"
              //   onClick={() => handleRemoveRow(row.key)}
            />
          </Menu>
        }
        popover={{portal: true}}
      />
    </Cell>
  )
}
