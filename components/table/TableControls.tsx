import {Stack, Button, MenuButton, Menu, MenuItem, MenuDivider} from '@sanity/ui'
import {Cell} from 'sanity-plugin-utils'
import {EllipsisVerticalIcon, CopyIcon, ClipboardIcon, ExpandIcon} from '@sanity/icons'

export default function TableControls() {
  return (
    <Cell paddingLeft={2} paddingBottom={2}>
      <MenuButton
        button={
          <Stack>
            <Button
              tone="primary"
              mode="ghost"
              paddingY={2}
              textAlign="center"
              icon={EllipsisVerticalIcon}
              // style={{width: `100%`}}
            />
          </Stack>
        }
        id={`table-context-menu`}
        menu={
          <Menu>
            <MenuItem
              icon={CopyIcon}
              text="Copy table"
              // onClick={handleCopyTable}
            />
            <MenuItem
              icon={ClipboardIcon}
              text="Paste table"
              // onClick={handlePasteTable}
            />
            <MenuDivider />
            <MenuItem
              icon={ExpandIcon}
              text="Expand"
              // onClick={() => handleOpenModal()}
            />
          </Menu>
        }
        popover={{portal: true}}
      />
    </Cell>
  )
}
