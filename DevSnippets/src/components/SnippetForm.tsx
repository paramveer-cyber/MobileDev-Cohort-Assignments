import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BorderRadius,
  Colors,
  LANGUAGES,
  Spacing,
  Typography,
} from "../constants/theme";
import { CreateSnippetInput, Language, Snippet } from "../types";
import LanguageBadge from "./LanguageBadge";
import TagInput from "./TagInput";

interface Props {
  initialValues?: Partial<Snippet>;
  onSubmit: (input: CreateSnippetInput) => Promise<void>;
  submitLabel: string;
}

export default function SnippetForm({
  initialValues,
  onSubmit,
  submitLabel,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [code, setCode] = useState(initialValues?.code ?? "");
  const [language, setLanguage] = useState<Language>(
    initialValues?.language ?? "javascript",
  );
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [isFavorite, setIsFavorite] = useState(
    initialValues?.isFavorite ?? false,
  );
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; code?: string }>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!code.trim()) e.code = "Code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        code: code.trim(),
        language,
        tags,
        isFavorite,
        attachments: initialValues?.attachments ?? [],
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors((e) => ({ ...e, title: undefined }));
              }}
              placeholder="e.g. Debounce Hook"
              placeholderTextColor={Colors.textMuted}
              returnKeyType="next"
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Language</Text>
            <Pressable
              style={styles.langSelector}
              onPress={() => setShowLangPicker(true)}
            >
              <LanguageBadge language={language} />
              <Text style={styles.langArrow}>▾</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Code *</Text>
            <TextInput
              style={[styles.codeInput, errors.code ? styles.inputError : null]}
              value={code}
              onChangeText={(text) => {
                setCode(text);
                setErrors((e) => ({ ...e, code: undefined }));
              }}
              placeholder={`paste your ${language} code here`}
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              keyboardType="default"
            />
            {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tags</Text>
            <TagInput tags={tags} onChange={setTags} />
          </View>

          <Pressable
            style={styles.favoriteToggle}
            onPress={() => setIsFavorite((v) => !v)}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? "⭐" : "☆"}</Text>
            <Text style={styles.favoriteLabel}>
              {isFavorite ? "Marked as favorite" : "Mark as favorite"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitBtnText}>
              {submitting ? "Saving..." : submitLabel}
            </Text>
          </Pressable>

          <View style={{ height: Spacing.xxl }} />
        </ScrollView>

        <Modal
          visible={showLangPicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowLangPicker(false)}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <Pressable onPress={() => setShowLangPicker(false)}>
                <Text style={styles.modalDone}>Done</Text>
              </Pressable>
            </View>
            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.langOption,
                    item === language && styles.langOptionSelected,
                  ]}
                  onPress={() => {
                    setLanguage(item as Language);
                    setShowLangPicker(false);
                  }}
                >
                  <LanguageBadge language={item as Language} />
                  {item === language && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              )}
            />
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  field: { marginBottom: Spacing.md },
  label: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: Spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  inputError: { borderColor: Colors.danger },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 4 },
  codeInput: {
    backgroundColor: Colors.codeBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: Typography.fontMono,
    lineHeight: 20,
    minHeight: 200,
  },
  langSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  langArrow: { color: Colors.textMuted, fontSize: 14 },
  favoriteToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  favoriteIcon: { fontSize: 20 },
  favoriteLabel: { color: Colors.textSecondary, fontSize: 14 },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: Colors.primaryText, fontSize: 16, fontWeight: "700" },
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { color: Colors.textPrimary, fontSize: 17, fontWeight: "700" },
  modalDone: { color: Colors.primary, fontSize: 16, fontWeight: "600" },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + "55",
  },
  langOptionSelected: { backgroundColor: Colors.primary + "15" },
  checkmark: { color: Colors.primary, fontSize: 18, fontWeight: "700" },
});
