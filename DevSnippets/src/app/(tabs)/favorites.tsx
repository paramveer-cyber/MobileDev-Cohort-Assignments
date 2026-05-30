import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import SnippetCard from "../../components/SnippetCard";
import { Colors, Spacing } from "../../constants/theme";
import { useSnippets } from "../../hooks/useSnippets";

export default function FavoritesScreen() {
  const router = useRouter();
  const { loading, reload, deleteSnippet, toggleFavorite, getFavorites } =
    useSnippets();
  const favorites = getFavorites();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  function handleDelete(id: string) {
    Alert.alert("Delete Snippet", "Are you sure?", [
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
      <FlatList
        data={favorites}
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
              icon="⭐"
              title="No favorites yet"
              subtitle="Star a snippet to save it here for quick access"
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
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
