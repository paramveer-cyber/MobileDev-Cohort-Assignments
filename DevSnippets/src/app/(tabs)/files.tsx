import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import {
  BorderRadius,
  Colors,
  Spacing,
  Typography,
} from "../../constants/theme";
import { SnippetFile } from "../../types";
import {
  ATTACHMENTS_DIR,
  deleteFile,
  formatFileSize,
  getFileIcon,
  listFiles,
  pickAndSaveImage,
  readFile,
  saveCodeFile,
  SNIPPETS_FILES_DIR,
} from "../../utils/fileSystem";

type FileTab = "files" | "attachments";

export default function FilesScreen() {
  const [activeTab, setActiveTab] = useState<FileTab>("files");
  const [files, setFiles] = useState<SnippetFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<{
    name: string;
    content: string;
  } | null>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const dir = activeTab === "files" ? SNIPPETS_FILES_DIR : ATTACHMENTS_DIR;
      const data = await listFiles(dir);
      setFiles(data);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [loadFiles]),
  );

  async function handlePreview(file: SnippetFile) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const imageExts = ["png", "jpg", "jpeg", "gif", "webp"];
    if (imageExts.includes(ext ?? "")) {
      Alert.alert(
        "Image File",
        `Path: ${file.path}\nSize: ${formatFileSize(file.size)}`,
      );
      return;
    }
    try {
      const content = await readFile(file.path);
      setPreviewFile({ name: file.name, content });
    } catch {
      Alert.alert("Error", "Cannot read this file type.");
    }
  }

  function handleDelete(file: SnippetFile) {
    Alert.alert("Delete File", `Delete "${file.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteFile(file.path);
          loadFiles();
        },
      },
    ]);
  }

  async function handleAddTemplate() {
    const templates = [
      {
        name: "fetch-api.ts",
        content: `async function fetchData<T>(url: string): Promise<T> {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);\n  return response.json();\n}\n`,
      },
      {
        name: "debounce.ts",
        content: `function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): T {\n  let timer: ReturnType<typeof setTimeout>;\n  return ((...args: any[]) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  }) as T;\n}\n`,
      },
      {
        name: "useLocalStorage.ts",
        content: `import { useState } from 'react';\n\nfunction useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  const setValue = (value: T) => {\n    setStoredValue(value);\n    localStorage.setItem(key, JSON.stringify(value));\n  };\n\n  return [storedValue, setValue] as const;\n}\n`,
      },
    ];

    Alert.alert("Download Template", "Choose a template to save locally:", [
      ...templates.map((t) => ({
        text: t.name,
        onPress: async () => {
          await saveCodeFile(t.name, t.content);
          loadFiles();
        },
      })),
      { text: "Cancel", style: "cancel" },
    ]);
  }

  async function handleAddImage() {
    const path = await pickAndSaveImage();
    if (path) loadFiles();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabs}>
        {(["files", "attachments"] as FileTab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "files" ? "📄 Code Files" : "🖼 Attachments"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.actionBar}>
        {activeTab === "files" ? (
          <Pressable style={styles.actionBtn} onPress={handleAddTemplate}>
            <Text style={styles.actionBtnText}>⬇ Download Template</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.actionBtn} onPress={handleAddImage}>
            <Text style={styles.actionBtnText}>📷 Add Image</Text>
          </Pressable>
        )}
        <Text style={styles.fileCount}>
          {files.length} file{files.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={files}
        keyExtractor={(item) => item.path}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadFiles}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.fileItem}
            onPress={() => handlePreview(item)}
          >
            <Text style={styles.fileIcon}>{getFileIcon(item.name)}</Text>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.fileMeta}>
                {formatFileSize(item.size)} ·{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Pressable
              style={styles.deleteBtn}
              onPress={() => handleDelete(item)}
              hitSlop={8}
            >
              <Text style={styles.deleteBtnText}>🗑</Text>
            </Pressable>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon={activeTab === "files" ? "📄" : "🖼"}
              title={
                activeTab === "files" ? "No files saved" : "No attachments"
              }
              subtitle={
                activeTab === "files"
                  ? "Download templates or save code files here"
                  : "Attach screenshots to snippets for context"
              }
            />
          )
        }
      />

      <Modal
        visible={!!previewFile}
        animationType="slide"
        onRequestClose={() => setPreviewFile(null)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {previewFile?.name}
            </Text>
            <Pressable onPress={() => setPreviewFile(null)} hitSlop={8}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.codeScroll} horizontal>
            <ScrollView>
              <Text style={styles.codeContent}>{previewFile?.content}</Text>
            </ScrollView>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  tabs: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary + "22",
    borderColor: Colors.primary,
  },
  tabText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    color: Colors.primary,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  actionBtn: {
    backgroundColor: Colors.surfaceRaised,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  fileCount: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  fileIcon: { fontSize: 24 },
  fileInfo: { flex: 1 },
  fileName: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  fileMeta: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 16 },
  modal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: 60,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    marginRight: Spacing.sm,
  },
  modalClose: {
    color: Colors.textSecondary,
    fontSize: 18,
  },
  codeScroll: {
    flex: 1,
    backgroundColor: Colors.codeBackground,
  },
  codeContent: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: Typography.fontMono,
    padding: Spacing.md,
    lineHeight: 18,
  },
});
