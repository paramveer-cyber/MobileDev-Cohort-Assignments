import * as SQLite from "expo-sqlite";
import { CreateSnippetInput, Snippet, UpdateSnippetInput } from "../types";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("devsnippets.db");
    await initializeSchema(db);
  }
  return db;
}

async function initializeSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS snippets (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'other',
      tags TEXT NOT NULL DEFAULT '[]',
      is_favorite INTEGER NOT NULL DEFAULT 0,
      attachments TEXT NOT NULL DEFAULT '[]',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_snippets_language ON snippets(language);
    CREATE INDEX IF NOT EXISTS idx_snippets_favorite ON snippets(is_favorite);
    CREATE INDEX IF NOT EXISTS idx_snippets_updated ON snippets(updated_at DESC);
  `);
}

function rowToSnippet(row: any): Snippet {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    language: row.language,
    tags: JSON.parse(row.tags || "[]"),
    isFavorite: row.is_favorite === 1,
    attachments: JSON.parse(row.attachments || "[]"),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export async function getAllSnippets(): Promise<Snippet[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    "SELECT * FROM snippets ORDER BY updated_at DESC",
  );
  return rows.map(rowToSnippet);
}

export async function searchSnippets(query: string): Promise<Snippet[]> {
  const database = await getDatabase();
  const q = `%${query}%`;
  const rows = await database.getAllAsync<any>(
    `SELECT * FROM snippets
     WHERE title LIKE ? OR code LIKE ? OR tags LIKE ? OR language LIKE ?
     ORDER BY updated_at DESC`,
    [q, q, q, q],
  );
  return rows.map(rowToSnippet);
}

export async function getFavoriteSnippets(): Promise<Snippet[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    "SELECT * FROM snippets WHERE is_favorite = 1 ORDER BY updated_at DESC",
  );
  return rows.map(rowToSnippet);
}

export async function getSnippetById(id: string): Promise<Snippet | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<any>(
    "SELECT * FROM snippets WHERE id = ?",
    [id],
  );
  return row ? rowToSnippet(row) : null;
}

export async function createSnippet(
  input: CreateSnippetInput,
): Promise<Snippet> {
  const database = await getDatabase();
  const now = Date.now();
  const id = generateId();

  await database.runAsync(
    `INSERT INTO snippets (id, title, code, language, tags, is_favorite, attachments, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.title,
      input.code,
      input.language,
      JSON.stringify(input.tags),
      input.isFavorite ? 1 : 0,
      JSON.stringify(input.attachments),
      now,
      now,
    ],
  );

  return {
    id,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateSnippet(
  id: string,
  input: UpdateSnippetInput,
): Promise<Snippet | null> {
  const database = await getDatabase();
  const existing = await getSnippetById(id);
  if (!existing) return null;

  const updated = { ...existing, ...input, updatedAt: Date.now() };

  await database.runAsync(
    `UPDATE snippets
     SET title = ?, code = ?, language = ?, tags = ?, is_favorite = ?, attachments = ?, updated_at = ?
     WHERE id = ?`,
    [
      updated.title,
      updated.code,
      updated.language,
      JSON.stringify(updated.tags),
      updated.isFavorite ? 1 : 0,
      JSON.stringify(updated.attachments),
      updated.updatedAt,
      id,
    ],
  );

  return updated;
}

export async function deleteSnippet(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM snippets WHERE id = ?", [id]);
}

export async function toggleFavorite(id: string): Promise<boolean> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{ is_favorite: number }>(
    "SELECT is_favorite FROM snippets WHERE id = ?",
    [id],
  );
  if (!row) return false;

  const newVal = row.is_favorite === 1 ? 0 : 1;
  await database.runAsync(
    "UPDATE snippets SET is_favorite = ?, updated_at = ? WHERE id = ?",
    [newVal, Date.now(), id],
  );
  return newVal === 1;
}

export async function getSnippetsByLanguage(
  language: string,
): Promise<Snippet[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<any>(
    "SELECT * FROM snippets WHERE language = ? ORDER BY updated_at DESC",
    [language],
  );
  return rows.map(rowToSnippet);
}
