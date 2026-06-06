import * as SQLite from "expo-sqlite";
import type { DriveSession } from "@/utils/driveTypes";

let initializationPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const db = await SQLite.openDatabaseAsync("safedrive.db");

    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS app_prefs (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS drive_sessions (
        id TEXT PRIMARY KEY,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        duration_seconds INTEGER NOT NULL DEFAULT 0,
        final_score INTEGER NOT NULL DEFAULT 100,
        safety_rating TEXT NOT NULL DEFAULT 'Excellent'
      );

      CREATE TABLE IF NOT EXISTS drive_events (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        type TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        severity REAL NOT NULL DEFAULT 0,
        FOREIGN KEY (session_id) REFERENCES drive_sessions(id)
      );
    `);

    return db;
  })();

  return initializationPromise;
}

export async function saveSession(session: DriveSession): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT OR REPLACE INTO drive_sessions
     (id, started_at, ended_at, duration_seconds, final_score, safety_rating)
     VALUES (?, ?, ?, ?, ?, ?)`,
    session.id,
    session.startedAt,
    session.endedAt ?? null,
    session.durationSeconds,
    session.finalScore,
    session.safetyRating
  );

  for (const event of session.events) {
    await db.runAsync(
      `INSERT OR REPLACE INTO drive_events (id, session_id, type, timestamp, severity)
       VALUES (?, ?, ?, ?, ?)`,
      event.id,
      session.id,
      event.type,
      event.timestamp,
      event.severity
    );
  }
}

export async function loadAllSessions(): Promise<DriveSession[]> {
  const db = await getDatabase();

  const sessionRows = await db.getAllAsync<{
    id: string;
    started_at: number;
    ended_at: number | null;
    duration_seconds: number;
    final_score: number;
    safety_rating: string;
  }>(`SELECT * FROM drive_sessions ORDER BY started_at DESC`);

  const sessions: DriveSession[] = [];

  for (const row of sessionRows) {
    const eventRows = await db.getAllAsync<{
      id: string;
      type: string;
      timestamp: number;
      severity: number;
    }>(
      `SELECT id, type, timestamp, severity FROM drive_events
       WHERE session_id = ? ORDER BY timestamp ASC`,
      row.id
    );

    sessions.push({
      id: row.id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      durationSeconds: row.duration_seconds,
      events: eventRows.map((e) => ({
        id: e.id,
        type: e.type as DriveSession["events"][number]["type"],
        timestamp: e.timestamp,
        severity: e.severity,
      })),
      finalScore: row.final_score,
      safetyRating: row.safety_rating,
    });
  }

  return sessions;
}

export async function loadSession(sessionId: string): Promise<DriveSession | null> {
  const db = await getDatabase();

  const row = await db.getFirstAsync<{
    id: string;
    started_at: number;
    ended_at: number | null;
    duration_seconds: number;
    final_score: number;
    safety_rating: string;
  }>(`SELECT * FROM drive_sessions WHERE id = ?`, sessionId);

  if (!row) return null;

  const eventRows = await db.getAllAsync<{
    id: string;
    type: string;
    timestamp: number;
    severity: number;
  }>(
    `SELECT id, type, timestamp, severity FROM drive_events
     WHERE session_id = ? ORDER BY timestamp ASC`,
    row.id
  );

  return {
    id: row.id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    durationSeconds: row.duration_seconds,
    events: eventRows.map((e) => ({
      id: e.id,
      type: e.type as DriveSession["events"][number]["type"],
      timestamp: e.timestamp,
      severity: e.severity,
    })),
    finalScore: row.final_score,
    safetyRating: row.safety_rating,
  };
}

export async function deleteSession(sessionId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`DELETE FROM drive_events WHERE session_id = ?`, sessionId);
  await db.runAsync(`DELETE FROM drive_sessions WHERE id = ?`, sessionId);
}


export async function getPref(key: string): Promise<string | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM app_prefs WHERE key = ?`,
    key
  ).catch(() => null);
  return row?.value ?? null;
}

export async function setPref(key: string, value: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO app_prefs (key, value) VALUES (?, ?)`,
    key,
    value
  );
}
