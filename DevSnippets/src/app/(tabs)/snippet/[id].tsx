import LanguageBadge from "@/components/LanguageBadge";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import {
  deleteSnippet as dbDeleteSnippet,
  toggleFavorite as dbToggleFavorite,
  updateSnippet,
} from "@/database/snippets";
import { useSnippet } from "@/hooks/useSnippets";
import { ExportFormat, saveExportLocally, shareExport } from "@/utils/export";
import { deleteFile, pickAndSaveImage, takePhoto } from "@/utils/fileSystem";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SnippetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { snippet, loading, refresh, setSnippet } = useSnippet(id);
  const [showExport, setShowExport] = useState(false);
  const [exporting, setExporting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!snippet) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Snippet not found</Text>
      </View>
    );
  }

  async function handleToggleFavorite() {
    const newVal = await dbToggleFavorite(id);
    setSnippet((prev) => (prev ? { ...prev, isFavorite: newVal } : prev));
  }

  async function handleDelete() {
    Alert.alert("Delete Snippet", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await dbDeleteSnippet(id);
          router.back();
        },
      },
    ]);
  }

  async function handleNativeShare() {
    await Share.share({
      message: `${snippet!.title}\nLanguage: ${snippet!.language}\n\n${snippet!.code}`,
      title: snippet!.title,
    });
  }

  async function handleExport(format: ExportFormat, mode: "share" | "save") {
    if (!snippet) return;
    setExporting(true);
    setShowExport(false);
    try {
      if (mode === "share") {
        await shareExport(snippet, format);
      } else {
        const path = await saveExportLocally(snippet, format);
        Alert.alert(
          "Saved",
          `Exported as ${format.toUpperCase()} to Files tab.\n${path.split("/").pop()}`,
        );
      }
    } catch {
      Alert.alert("Export Failed", "Could not export this snippet.");
    } finally {
      setExporting(false);
    }
  }

  async function handleAddAttachment() {
    Alert.alert("Add Attachment", "Choose source:", [
      { text: "Photo Library", onPress: () => addFromLibrary() },
      { text: "Take Photo", onPress: () => addPhoto() },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  async function addFromLibrary() {
    const path = await pickAndSaveImage(id);
    if (path && snippet) {
      const updated = await updateSnippet(id, {
        attachments: [...snippet.attachments, path],
      });
      if (updated) setSnippet(updated);
    }
  }

  async function addPhoto() {
    const path = await takePhoto(id);
    if (path && snippet) {
      const updated = await updateSnippet(id, {
        attachments: [...snippet.attachments, path],
      });
      if (updated) setSnippet(updated);
    }
  }

  async function handleDeleteAttachment(path: string) {
    Alert.alert("Remove Attachment", "Remove this attachment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await deleteFile(path);
          if (snippet) {
            const updated = await updateSnippet(id, {
              attachments: snippet.attachments.filter((a) => a !== path),
            });
            if (updated) setSnippet(updated);
          }
        },
      },
    ]);
  }

  const exportFormats: ExportFormat[] = ["txt", "js", "json"];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <Text style={styles.title}>
                <Ionicons name="arrow-back" size={24} />
              </Text>
            </Pressable>
            <Text style={styles.title}>{snippet.title}</Text>
            <Pressable onPress={handleToggleFavorite} hitSlop={8}>
              <Text style={styles.favIcon}>
                {snippet.isFavorite ? "⭐" : "☆"}
              </Text>
            </Pressable>
          </View>
          <View style={styles.meta}>
            <LanguageBadge language={snippet.language} />
            <Text style={styles.dateText}>
              Updated {new Date(snippet.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {snippet.tags.length > 0 && (
          <View style={styles.section}>
            <View style={styles.tagRow}>
              {snippet.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.codeBlock}>
          <View style={styles.codeHeader}>
            <Text style={styles.codeLabel}>{snippet.language}</Text>
            <View style={styles.codeActions}>
              <Pressable
                onPress={handleNativeShare}
                hitSlop={8}
                style={styles.codeActionBtn}
              >
                <Text style={styles.codeActionText}>⬆ Share</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowExport(true)}
                hitSlop={8}
                style={[styles.codeActionBtn, styles.exportBtn]}
              >
                <Text style={styles.exportBtnText}>
                  {exporting ? "..." : "⬇ Export"}
                </Text>
              </Pressable>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text style={styles.code} selectable>
              {snippet.code}
            </Text>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Attachments ({snippet.attachments.length})
            </Text>
            <Pressable
              onPress={handleAddAttachment}
              style={styles.addAttachBtn}
            >
              <Text style={styles.addAttachText}>+ Add</Text>
            </Pressable>
          </View>
          {snippet.attachments.map((path) => {
            const name = path.split("/").pop() ?? "file";
            return (
              <Pressable
                key={path}
                style={styles.attachItem}
                onLongPress={() => handleDeleteAttachment(path)}
              >
                <Image
                  source={{ uri: path }}
                  style={styles.attachThumb}
                  resizeMode="cover"
                />
                <View style={styles.attachInfo}>
                  <Text style={styles.attachName} numberOfLines={1}>
                    {name}
                  </Text>
                  <Text style={styles.attachHint}>Long press to remove</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => router.push(`/snippet/edit/${id}`)}
          >
            <Text style={styles.actionBtnText}>✏️ Edit Snippet</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={handleDelete}
          >
            <Text style={[styles.actionBtnText, { color: Colors.danger }]}>
              🗑 Delete
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={showExport}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExport(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowExport(false)}
        >
          <View style={styles.exportSheet}>
            <View style={styles.exportHandle} />
            <Text style={styles.exportTitle}>Export Snippet</Text>
            <Text style={styles.exportSubtitle}>Choose format and action</Text>

            {exportFormats.map((fmt) => (
              <View key={fmt} style={styles.exportRow}>
                <Text style={styles.exportFormatLabel}>.{fmt}</Text>
                <View style={styles.exportRowBtns}>
                  <Pressable
                    style={styles.exportActionBtn}
                    onPress={() => handleExport(fmt, "save")}
                  >
                    <Text style={styles.exportActionText}>💾 Save</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.exportActionBtn, styles.exportShareBtn]}
                    onPress={() => handleExport(fmt, "share")}
                  >
                    <Text style={styles.exportShareText}>⬆ Share</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <Pressable
              style={styles.cancelBtn}
              onPress={() => setShowExport(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  loadingText: { color: Colors.textSecondary, fontSize: 15 },
  header: { marginBottom: Spacing.md },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  title: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginRight: Spacing.sm,
  },
  favIcon: { fontSize: 24 },
  meta: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  dateText: { color: Colors.textMuted, fontSize: 12 },
  section: { marginBottom: Spacing.md },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.xs },
  tag: {
    backgroundColor: Colors.surfaceRaised,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: { color: Colors.primary, fontSize: 12 },
  codeBlock: {
    backgroundColor: Colors.codeBackground,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  codeLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: Typography.fontMono,
  },
  codeActions: { flexDirection: "row", gap: Spacing.sm },
  codeActionBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  codeActionText: { color: Colors.primary, fontSize: 13, fontWeight: "600" },
  exportBtn: {
    backgroundColor: Colors.primary + "22",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  exportBtnText: { color: Colors.primary, fontSize: 13, fontWeight: "700" },
  code: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontFamily: Typography.fontMono,
    lineHeight: 20,
    padding: Spacing.md,
  },
  addAttachBtn: {
    backgroundColor: Colors.surfaceRaised,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  addAttachText: { color: Colors.primary, fontSize: 13, fontWeight: "600" },
  attachItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  attachThumb: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceRaised,
  },
  attachInfo: { flex: 1 },
  attachName: { color: Colors.textPrimary, fontSize: 13, fontWeight: "500" },
  attachHint: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  actions: { gap: Spacing.sm, marginTop: Spacing.md },
  actionBtn: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    borderWidth: 1,
  },
  editBtn: {
    backgroundColor: Colors.primary + "22",
    borderColor: Colors.primary,
  },
  deleteBtn: {
    backgroundColor: Colors.danger + "11",
    borderColor: Colors.danger + "44",
  },
  actionBtnText: { color: Colors.textPrimary, fontSize: 15, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  exportSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomWidth: 0,
  },
  exportHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  exportTitle: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  exportSubtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  exportRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exportFormatLabel: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Typography.fontMono,
    minWidth: 48,
  },
  exportRowBtns: { flexDirection: "row", gap: Spacing.sm },
  exportActionBtn: {
    backgroundColor: Colors.surfaceRaised,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exportActionText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  exportShareBtn: {
    backgroundColor: Colors.primary + "22",
    borderColor: Colors.primary,
  },
  exportShareText: { color: Colors.primary, fontSize: 13, fontWeight: "700" },
  cancelBtn: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: { color: Colors.textSecondary, fontSize: 15, fontWeight: "600" },
});
