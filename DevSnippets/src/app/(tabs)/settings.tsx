import * as FileSystem from "expo-file-system";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BorderRadius, Colors, Spacing } from "../../constants/theme";
import {
  APP_DOCUMENTS_DIR,
  ensureDirectoriesExist,
  listFiles,
  SNIPPETS_FILES_DIR,
} from "../../utils/fileSystem";

interface StatRow {
  label: string;
  value: string;
}

function Row({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text
        style={[rowStyles.value, small && rowStyles.valueSmall]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

export default function SettingsScreen() {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  async function loadStorageStats() {
    setLoadingStats(true);
    try {
      await ensureDirectoriesExist();
      const exportedFiles = await listFiles(SNIPPETS_FILES_DIR);
      const totalBytes = exportedFiles.reduce((sum, f) => sum + f.size, 0);
      setStats([
        { label: "Exported Files", value: String(exportedFiles.length) },
        { label: "Export Storage Used", value: formatBytes(totalBytes) },
        { label: "App Data Dir", value: APP_DOCUMENTS_DIR },
      ]);
    } catch {
      setStats([]);
    } finally {
      setLoadingStats(false);
    }
  }

  async function handleClearExports() {
    Alert.alert(
      "Clear Exported Files",
      "This will delete all files in the exports folder. Snippets in the database are unaffected.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const files = await listFiles(SNIPPETS_FILES_DIR);
              for (const f of files) {
                await FileSystem.deleteAsync(f.path, { idempotent: true });
              }
              Alert.alert("Done", "Export folder cleared.");
              loadStorageStats();
            } catch {
              Alert.alert("Error", "Could not clear exports.");
            }
          },
        },
      ],
    );
  }

  function formatBytes(b: number): string {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.card}>
          <Row label="App" value="DevSnippets" />
          <Row label="Version" value="1.0.0" />
          <Row label="Theme" value="Black + Yellow" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>STORAGE</Text>
        <Pressable style={styles.card} onPress={loadStorageStats}>
          {loadingStats ? (
            <Text style={styles.hint}>Loading...</Text>
          ) : stats.length === 0 ? (
            <Text style={styles.hint}>Tap to load storage info</Text>
          ) : (
            stats.map((s) => (
              <Row
                key={s.label}
                label={s.label}
                value={s.value}
                small={s.label === "App Data Dir"}
              />
            ))
          )}
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EXPORT</Text>
        <View style={styles.card}>
          <Text style={styles.infoText}>
            Snippets can be exported as .txt, .js, or .json from the snippet
            detail screen. Exported files are saved to the app's local files
            folder and can be shared with other apps.
          </Text>
        </View>
        <Pressable style={[styles.dangerBtn]} onPress={handleClearExports}>
          <Text style={styles.dangerBtnText}>🗑 Clear Exported Files</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  valueSmall: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  section: { marginBottom: Spacing.lg },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  hint: {
    color: Colors.textMuted,
    fontSize: 13,
    paddingVertical: Spacing.sm,
    textAlign: "center",
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    paddingVertical: Spacing.sm,
  },
  dangerBtn: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.danger + "15",
    borderWidth: 1,
    borderColor: Colors.danger + "55",
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  dangerBtnText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "600",
  },
});
