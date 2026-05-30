export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "cpp"
  | "css"
  | "html"
  | "sql"
  | "json"
  | "other";

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: Language;
  tags: string[];
  isFavorite: boolean;
  attachments: string[]; // file paths
  createdAt: number;
  updatedAt: number;
}

export interface SnippetFile {
  name: string;
  path: string;
  size: number;
  mimeType?: string;
  createdAt: number;
  snippetId?: string;
}

export type CreateSnippetInput = Omit<
  Snippet,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateSnippetInput = Partial<CreateSnippetInput>;
