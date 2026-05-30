import SnippetForm from "@/components/SnippetForm";
import { createSnippet } from "@/database/snippets";
import { CreateSnippetInput } from "@/types";
import { useRouter } from "expo-router";
import React from "react";

export default function CreateSnippetScreen() {
  const router = useRouter();

  async function handleSubmit(input: CreateSnippetInput) {
    await createSnippet(input);
    router.back();
  }

  return <SnippetForm onSubmit={handleSubmit} submitLabel="Save Snippet" />;
}
