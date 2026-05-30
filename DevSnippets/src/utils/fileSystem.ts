import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { SnippetFile } from "../types";

export const APP_DOCUMENTS_DIR = FileSystem.documentDirectory + "devsnippets/";
export const SNIPPETS_FILES_DIR = APP_DOCUMENTS_DIR + "files/";
export const ATTACHMENTS_DIR = APP_DOCUMENTS_DIR + "attachments/";

export async function ensureDirectoriesExist(): Promise<void> {
  for (const dir of [APP_DOCUMENTS_DIR, SNIPPETS_FILES_DIR, ATTACHMENTS_DIR]) {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }
}

export async function saveCodeFile(
  filename: string,
  content: string,
  snippetId?: string,
): Promise<SnippetFile> {
  await ensureDirectoriesExist();
  const path = SNIPPETS_FILES_DIR + filename;
  await FileSystem.writeAsStringAsync(path, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const info = await FileSystem.getInfoAsync(path, { size: true });
  return {
    name: filename,
    path,
    size: (info as any).size ?? 0,
    createdAt: Date.now(),
    snippetId,
  };
}

export async function listFiles(directory?: string): Promise<SnippetFile[]> {
  await ensureDirectoriesExist();
  const dir = directory || SNIPPETS_FILES_DIR;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) return [];

  const items = await FileSystem.readDirectoryAsync(dir);
  const files: SnippetFile[] = [];

  for (const name of items) {
    const path = dir + name;
    const fileInfo = await FileSystem.getInfoAsync(path, { size: true });
    if (fileInfo.exists && !fileInfo.isDirectory) {
      files.push({
        name,
        path,
        size: (fileInfo as any).size ?? 0,
        createdAt: (fileInfo as any).modificationTime
          ? (fileInfo as any).modificationTime * 1000
          : Date.now(),
      });
    }
  }

  return files.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteFile(path: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(path);
  if (info.exists) {
    await FileSystem.deleteAsync(path);
  }
}

export async function readFile(path: string): Promise<string> {
  return FileSystem.readAsStringAsync(path, {
    encoding: FileSystem.EncodingType.UTF8,
  });
}

export async function copyFile(
  sourcePath: string,
  destDir: string,
): Promise<string> {
  await ensureDirectoriesExist();
  const fileName = sourcePath.split("/").pop() ?? "file";
  const destPath = destDir + fileName;
  await FileSystem.copyAsync({ from: sourcePath, to: destPath });
  return destPath;
}

export async function moveFile(
  sourcePath: string,
  destDir: string,
): Promise<string> {
  await ensureDirectoriesExist();
  const fileName = sourcePath.split("/").pop() ?? "file";
  const destPath = destDir + fileName;
  await FileSystem.moveAsync({ from: sourcePath, to: destPath });
  return destPath;
}

export async function pickAndSaveImage(
  snippetId?: string,
): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets[0]) return null;

  await ensureDirectoriesExist();
  const asset = result.assets[0];
  const ext = asset.uri.split(".").pop() ?? "jpg";
  const filename = `img_${Date.now()}.${ext}`;
  const destPath =
    ATTACHMENTS_DIR + (snippetId ? `${snippetId}_` : "") + filename;
  await FileSystem.copyAsync({ from: asset.uri, to: destPath });
  return destPath;
}

export async function takePhoto(snippetId?: string): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets[0]) return null;

  await ensureDirectoriesExist();
  const asset = result.assets[0];
  const filename = `photo_${Date.now()}.jpg`;
  const destPath =
    ATTACHMENTS_DIR + (snippetId ? `${snippetId}_` : "") + filename;
  await FileSystem.copyAsync({ from: asset.uri, to: destPath });
  return destPath;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const icons: Record<string, string> = {
    js: "📄",
    ts: "📄",
    tsx: "📄",
    jsx: "📄",
    py: "🐍",
    go: "🐹",
    rs: "🦀",
    java: "☕",
    swift: "🦅",
    kt: "📱",
    cpp: "⚙️",
    c: "⚙️",
    css: "🎨",
    html: "🌐",
    json: "📋",
    yaml: "📋",
    yml: "📋",
    md: "📝",
    sh: "🖥️",
    sql: "🗄️",
    png: "🖼️",
    jpg: "🖼️",
    jpeg: "🖼️",
    gif: "🖼️",
    webp: "🖼️",
    svg: "🖼️",
    pdf: "📕",
    zip: "📦",
    tar: "📦",
    gz: "📦",
    txt: "📃",
  };
  return icons[ext ?? ""] ?? "📁";
}
