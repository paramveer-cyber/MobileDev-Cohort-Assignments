import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import SearchBar from "../../components/SearchBar";
import SnippetCard from "../../components/SnippetCard";
import { BorderRadius, Colors, Spacing } from "../../constants/theme";
import { useSnippets } from "../../hooks/useSnippets";
import { Snippet } from "../../types";

export default function SnippetsScreen() {
  const router = useRouter();
  const {
    snippets,
    loading,
    reload,
    deleteSnippet,
    toggleFavorite,
    searchSnippets,
  } = useSnippets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Snippet[]>([]);
  const [searching, setSearching] = useState(false);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  useEffect(() => {
    if (!query.trim()) {
      setResults(snippets);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      const found = await searchSnippets(query);
      setResults(found);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, snippets, searchSnippets]);

  function handleDelete(id: string) {
    Alert.alert("Delete Snippet", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteSnippet(id),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <SearchBar value={query} onChangeText={setQuery} />
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/snippet/create")}
        >
          <Ionicons name="add" size={26} color={Colors.primaryText} />
        </Pressable>
      </View>

      {!query && (
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {snippets.length} snippet{snippets.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {query && (
        <Text style={styles.searchHint}>
          {searching
            ? "Searching..."
            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
        </Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SnippetCard
            snippet={item}
            onPress={() => router.push(`/snippet/${item.id}`)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={reload}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          loading ? null : (
            <EmptyState
              icon="code-slash"
              title={query ? "No snippets found" : "No snippets yet"}
              subtitle={
                query
                  ? "Try a different search term"
                  : "Tap + to add your first code snippet"
              }
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  searchWrapper: {
    flex: 1,
  },
  addBtn: {
    backgroundColor: Colors.primary,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  statsText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  searchHint: {
    color: Colors.textMuted,
    fontSize: 12,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
