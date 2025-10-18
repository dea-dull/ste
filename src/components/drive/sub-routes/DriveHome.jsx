// src/routes/DriveHome.jsx
import { useState } from "react";
import {
  Box,
  Group,
  Text,
  Card,
  SimpleGrid,
  Progress,
  Table,
  ActionIcon,
  Menu,
  TextInput,
  Button,
} from "@mantine/core";
import {
  IconFile,
  IconFolder,
  IconShare,
  IconDotsVertical,
  IconDownload,
  IconTrash,
  IconEdit,
  IconFolder as IconFolderSmall,
} from "@tabler/icons-react";
import "../DriveRoutes.css";

// Your components (paths assumed based on your examples)
// adjust import paths if yours are located elsewhere
import { default as CardModal } from "../../ui/Card.jsx";
import SingleInputModal from "../../ui/SingleInputModal.jsx";
import { default as GlassButton} from "../../ui/Button.jsx";
import WhiteButton from "../../ui/WhiteButton.jsx";

const stats = [
  { label: "Total Files", value: 42, icon: IconFile },
  { label: "Folders", value: 7, icon: IconFolder },
  { label: "Shared Files", value: 19, icon: IconShare },
];

const initialFiles = [
  { id: 1, name: "Resume.docx", type: "docx", modified: "2025-10-05" },
  { id: 2, name: "Project Plan.pdf", type: "pdf", modified: "2025-10-04" },
  { id: 3, name: "Team Notes.txt", type: "txt", modified: "2025-10-03" },
  { id: 4, name: "Photos", type: "folder", modified: "2025-10-02" },
];

export default function DriveHome() {
  const [recentFiles, setRecentFiles] = useState(initialFiles);

  // selection/modals
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);

  // open delete confirmation
  const handleDeleteClick = (file) => {
    setSelectedFile(file);
    setDeleteOpen(true);
  };

  // confirm delete action
  const confirmDelete = () => {
    if (!selectedFile) return;
    setRecentFiles((prev) => prev.filter((f) => f.id !== selectedFile.id));
    setSelectedFile(null);
    setDeleteOpen(false);
  };

  // open rename modal
  const handleRenameClick = (file) => {
    setSelectedFile(file);
    setRenameOpen(true);
  };

  // confirm rename from SingleInputModal, value comes from modal
  const confirmRename = (value) => {
    if (!selectedFile) return;
    const newName = value?.trim();
    if (!newName) {
      // keep original if empty — you can change this behaviour if you want
      setRenameOpen(false);
      setSelectedFile(null);
      return;
    }
    setRecentFiles((prev) =>
      prev.map((f) => (f.id === selectedFile.id ? { ...f, name: newName } : f))
    );
    setSelectedFile(null);
    setRenameOpen(false);
  };

  return (
    <Box className="drive-home-container">
      <Card shadow="md" p="lg" radius="md" className="drive-home-banner">
        <Text size="xl" fw={700} mb={6} className="drive-home-heading">
          Welcome to your Drive
        </Text>
        <Text size="sm" color="dimmed">
          Securely store, organize, and share your files. Use the sidebar to
          browse your Drive.
        </Text>
      </Card>

      <SimpleGrid
        cols={{ base: 1, sm: 3 }}
        spacing="md"
        mt="xl"
        className="drive-home-stats"
      >
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} p="md" radius="md" className="drive-home-stat-card">
            <Group align="center" gap="md">
              <Icon size={34} className="drive-home-stat-icon" />
              <Box>
                <Text size="xl" fw={600}>
                  {value}
                </Text>
                <Text size="sm" color="dimmed">
                  {label}
                </Text>
              </Box>
            </Group>
          </Card>
        ))}
      </SimpleGrid>

      <Box mt="xl" className="drive-home-storage-progress">
        <Text size="sm" mb={4}>
          Storage Usage
        </Text>
        <Progress value={14} color="teal" size="lg" radius="xl" />
        <Text size="xs" mt={2} color="dimmed">
          2.1 GB used of 15 GB ({((2.1 / 15) * 100).toFixed(1)}%)
        </Text>
      </Box>

      {/* Recent Files Section */}
      {/* NOTE: modal overlays are rendered inside this Box so they cover only this section */}
      <Box
        mt="xl"
        className="drive-home-recent-section"
        style={{ position: "relative" }} // ensures Card overlay positions relative to this box
      >
        <Text fw={600} size="lg" mb={10} className="drive-recent-heading">
          Recent Files
        </Text>

        <Table highlightOnHover className="drive-home-recent-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recentFiles.map((file) => (
              <tr key={file.id}>
                <td>
                  <Group>
                    {file.type === "folder" ? (
                      <IconFolderSmall size={17} color="#8ef58a" />
                    ) : (
                      <IconFile size={17} />
                    )}
                    <Text>{file.name}</Text>
                  </Group>
                </td>
                <td>{file.modified}</td>
                <td>
                  <Menu withArrow shadow="md">
                    <Menu.Target>
                      <ActionIcon variant="subtle" className="custom-action-icon">
                        <IconDotsVertical size={18} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item icon={<IconDownload size={16} />}>
                        Download
                      </Menu.Item>

                      <Menu.Item
                        icon={<IconEdit size={16} />}
                        onClick={() => handleRenameClick(file)}
                      >
                        Rename
                      </Menu.Item>

                      <Menu.Item
                        icon={<IconTrash size={16} />}
                        color="red"
                        onClick={() => handleDeleteClick(file)}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ---------- Delete Confirmation (uses your Card component) ---------- */}
        {deleteOpen && selectedFile && (
          <div
            // wrapper to limit overlay area if Card's overlay is positioned absolute
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none", // avoid blocking underlying events except inside Card itself
            }}
          >
            <div style={{ pointerEvents: "auto" }}>
              <CardModal
                title="Delete File"
                message={`Are you sure you want to delete "${selectedFile.name}"?`}
                onClose={() => {
                  setDeleteOpen(false);
                  setSelectedFile(null);
                }}
              >
                <div style={{ display: "flex", gap: 8, marginTop: 15 }}>
                  {/* Use your GlassButton for Cancel, WhiteButton for Delete */}
                  <GlassButton onClick={() => { setDeleteOpen(false); setSelectedFile(null); }}>
                    Cancel
                  </GlassButton>
                  <WhiteButton onClick={confirmDelete} color="red">
                    Delete
                  </WhiteButton>
                </div>
              </CardModal>
            </div>
          </div>
        )}

        {/* ---------- Rename (uses your SingleInputModal) ---------- */}
        {renameOpen && selectedFile && (
          <div
            // keep rename modal inside this section as well
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{ pointerEvents: "auto" }}>
              <SingleInputModal
                title="Rename File"
                description="Enter a new name for the file"
                inputLabel="File Name"
                inputPlaceholder={selectedFile?.name}
                buttonLabel="Rename"
                onSubmit={confirmRename}
                onClose={() => {
                  setRenameOpen(false);
                  setSelectedFile(null);
                }}
              />
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
}
