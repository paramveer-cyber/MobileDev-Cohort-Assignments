import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Snippet } from "../types";
import { SNIPPETS_FILES_DIR, ensureDirectoriesExist } from "./fileSystem";

export type ExportFormat = "txt" | "js" | "json";

export function buildExportContent(
  snippet: Snippet,
  format: ExportFormat,
): string {
  if (format === "json") {
    return JSON.stringify(
      {
        title: snippet.title,
        language: snippet.language,
        tags: snippet.tags,
        code: snippet.code,
        createdAt: snippet.createdAt,
        updatedAt: snippet.updatedAt,
      },
      null,
      2,
    );
  }

  if (format === "txt") {
    const tagLine =
      snippet.tags.length > 0 ? `Tags: ${snippet.tags.join(", ")}` : "";
    return [
      `Title: ${snippet.title}`,
      `Language: ${snippet.language}`,
      tagLine,
      "",
      snippet.code,
    ]
      .filter((l) => l !== undefined && !(l === "" && tagLine === ""))
      .join("\n");
  }

  return snippet.code;
}

export function buildExportFilename(
  snippet: Snippet,
  format: ExportFormat,
): string {
  const safe = snippet.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40);
  return `${safe}.${format}`;
}

export async function saveExportLocally(
  snippet: Snippet,
  format: ExportFormat,
): Promise<string> {
  await ensureDirectoriesExist();
  const content = buildExportContent(snippet, format);
  const filename = buildExportFilename(snippet, format);
  const path = SNIPPETS_FILES_DIR + filename;
  await FileSystem.writeAsStringAsync(path, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return path;
}

export async function shareExport(
  snippet: Snippet,
  format: ExportFormat,
): Promise<void> {
  const path = await saveExportLocally(snippet, format);
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(path, {
      mimeType: getMimeType(format),
      dialogTitle: `Share ${snippet.title}`,
    });
  }
}

function getMimeType(format: ExportFormat): string {
  if (format === "json") return "application/json";
  if (format === "js") return "text/javascript";
  return "text/plain";
}
