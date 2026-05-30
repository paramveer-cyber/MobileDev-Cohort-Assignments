# DevSnippets

A mobile app for saving and organizing code snippets, built with Expo, React Native, and TypeScript.

## Features

### Snippet Management

Create, edit, delete, and search snippets. Each snippet stores a title, code content, programming language, and tags. Snippets can be marked as favorites for quick access.

### Offline-First Storage

All data lives locally in a SQLite database (`devsnippets.db`) via `expo-sqlite`. Every core operation — creating, editing, searching, viewing favorites — works fully offline. There is no required network dependency for any of these features.

**Database schema:**

```
snippets (id, title, code, language, tags, is_favorite, attachments, created_at, updated_at)
```

Indexes on `language`, `is_favorite`, and `updated_at` keep queries fast as the collection grows.

### File Management

Attachments (photos from library or camera) can be added to any snippet and are stored locally via `expo-file-system`. The Files tab lets you browse, download, and delete exported files. Exported files are organized under the app's documents directory.

### Export & Sharing

Snippets can be exported as `.txt`, `.js`, or `.json` — either saved locally to the Files tab or shared to other apps via the native share sheet.

## Screens

- **Home** — browse, search, and manage all snippets
- **Snippet Detail** — view code, tags, attachments, export options
- **Create / Edit** — snippet form with language picker and tag input
- **Favorites** — filtered view of starred snippets
- **Files** — local file browser for exported snippets
- **Settings** — storage stats and app info

## Storage Summary

| Technology      | Usage                          |
| --------------- | ------------------------------ |
| SQLite          | Snippet database               |
| Expo FileSystem | Attachments and exported files |

## Getting Started

```bash
bun i
bunx expo start
```

Open in Expo Go, an iOS simulator, or an Android emulator.

## Project Structure

```
src/
  app/          # Screens and navigation (Expo Router)
  components/   # Shared UI components
  database/     # SQLite queries
  hooks/        # Data hooks
  utils/        # Export and file system helpers
  types/        # TypeScript types
  constants/    # Theme
```
