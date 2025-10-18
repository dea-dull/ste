import { useState } from "react";
import { Table, Box, Badge, ActionIcon, Group, Checkbox, Tooltip, Text, Button, Menu } from "@mantine/core";
import {
  IconDotsVertical, IconFile, IconFolder, IconDownload, IconShare, IconInfoCircle,
  IconEdit, IconCopy, IconTrash, IconArrowsMove,
} from "@tabler/icons-react";
import "../DriveRoutes.css";

// Mock data
const initialFiles = [
  {
    id: 1, title: "Project Plan.pdf", type: "pdf", status: "Private",
    modified: "2025-10-01", size: "2.3 MB",
  },
  {
    id: 2, title: "Photos", type: "folder", status: "Shared",
    modified: "2025-09-28", size: "--",
  },
  {
    id: 3, title: "Resume.docx", type: "docx", status: "Private",
    modified: "2025-09-20", size: "153 KB",
  },
  {
    id: 4, title: "Team Notes.txt", type: "txt", status: "Shared",
    modified: "2025-09-18", size: "8 KB",
  },
  {
    id: 5, title: "Archive.zip", type: "zip", status: "Private",
    modified: "2025-09-12", size: "3.8 MB",
  },
];

const typeIcon = (type) =>
  type === "folder" ? <IconFolder color="#8ef58a" size={18} /> : <IconFile size={18} />;

export default function DriveRecent() {
  const [selected, setSelected] = useState([]);
  const [files, setFiles] = useState(initialFiles);

  const toggleSelect = (id) => {
    setSelected((sel) =>
      sel.includes(id) ? sel.filter((i) => i !== id) : [...sel, id]
    );
  };
  const selectAll = () =>
    setSelected(selected.length === files.length ? [] : files.map((f) => f.id));

  // Bulk actions (implement as needed)
  const bulkDelete = () => {
    setFiles((fs) => fs.filter((f) => !selected.includes(f.id)));
    setSelected([]);
  };

  // Single actions (implement as needed)
  const onDelete = (id) => {
    setFiles((fs) => fs.filter((f) => f.id !== id));
    setSelected((sel) => sel.filter((sid) => sid !== id));
  };

  return (
    <Box style={{
      flex: 1,
      background: "linear-gradient(90deg, #000 0%, #011 100%)",
      color: "rgba(255,255,255,0.87)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}>
      {/* Top bar actions */}
      <Group mb="sm" position="apart">
        <Group>
          <Checkbox
            checked={selected.length === files.length && files.length > 0}
            indeterminate={selected.length > 0 && selected.length < files.length}
            onChange={selectAll}
          />
          <Text size="sm">{selected.length} selected</Text>
        </Group>
        <Group>
          <Tooltip label="Copy">
            <ActionIcon variant="light" color="teal" disabled={selected.length === 0}>
              <IconCopy />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Move">
            <ActionIcon variant="light" color="teal" disabled={selected.length === 0}>
              <IconArrowsMove />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon variant="light" color="red" disabled={selected.length === 0} onClick={bulkDelete}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      {/* Table/Grid */}
      <Table className="drive-table"highlightOnHover verticalSpacing="sm" striped >
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Status</th>
            <th>Last Modified</th>
            <th>Size</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {files.map((f) => (
            <tr key={f.id} style={{ background: selected.includes(f.id) ? "rgba(142,245,138,0.08)" : "transparent" }}>
              <td>
                <Checkbox checked={selected.includes(f.id)} onChange={() => toggleSelect(f.id)} />
              </td>
              <td>
                <Group spacing="xs">
                  {typeIcon(f.type)}
                  <Text>{f.title}</Text>
                </Group>
              </td>
              <td>
                <Badge color={f.status === "Private" ? "gray" : "teal"} variant="light">{f.status}</Badge>
              </td>
              <td>{f.modified}</td>
              <td>{f.size}</td>
              <td><Text>{f.type.toUpperCase()}</Text></td>
              <td>
                <Menu shadow="md" width={180} position="bottom-end" withArrow>
                  <Menu.Target>
                    <ActionIcon variant="transparent" className="dots-icon">
                      <IconDotsVertical />
                    </ActionIcon>



                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item icon={<IconEdit size={16} />}>Rename</Menu.Item>
                    <Menu.Item icon={<IconCopy size={16} />}>Copy</Menu.Item>
                    <Menu.Item icon={<IconArrowsMove size={16} />}>Move To</Menu.Item>
                    <Menu.Item icon={<IconDownload size={16} />}>Download</Menu.Item>
                    <Menu.Item icon={<IconShare size={16} />}>Share</Menu.Item>
                    <Menu.Item icon={<IconInfoCircle size={16} />}>Info</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item icon={<IconTrash size={16} />} color="red" onClick={() => onDelete(f.id)}>Delete</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Storage info at the bottom */}
      <Box mt="auto" style={{
        borderTop: "1px solid #222",
        paddingTop: 12,
        color: "rgba(255,255,255,0.7)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span className="storage-span">Storage: 2.1 GB used of 15 GB</span>
              <Button
        size="xs"
        variant="subtle"
        color="teal"
        styles={{
          root: {
            backgroundColor: 'transparent',
            '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.1)' }, // soft hover tint
          },
        }}
      >
        Manage Storage
      </Button>

      </Box>
    </Box>
  );
}