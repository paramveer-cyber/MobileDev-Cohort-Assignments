import { ImageBackground } from "expo-image";
import { useEffect, useState } from "react";
import { DimensionValue, FlatList, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Switch, Text, TextInput, View, useColorScheme, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Note {
  id: number;
  title: string;
  description?: string;
  createdOn: Date;
}

const themes = {
  light: {
    background: "#f0f0f5",
    card: "#ffffff",
    border: "#d1d1d6",
    textPrimary: "#000000",
    textSecondary: "#666666",
    accent: "#ff7a00",
    accentBorder: "#e66e00",
    inputBg: "#ffffff",
    inputBorder: "#c7c7cc",
    overlay: "rgba(0,0,0,0.5)",
    modalBg: "#ffffff",
    switchBg: "#f2f2f7",
  },
  dark: {
    background: "#050505",
    card: "#0b0b0b",
    border: "#1f1f1f",
    textPrimary: "#f3f3f3",
    textSecondary: "#8a8a8a",
    accent: "#ff7a00",
    accentBorder: "#ff9d42",
    inputBg: "#0d0d0d",
    inputBorder: "#1e1e1e",
    overlay: "rgba(0,0,0,0.92)",
    modalBg: "#090909",
    switchBg: "#101010",
  },
};

export function NoteCard({ data, setEditor, setNote, theme, numColumns }: { data: Note; setEditor: Function; setNote: Function; theme: typeof themes.dark; numColumns: number }) {
  const handleClick = () => {
    setNote(data.id);
    setEditor(true);
  };

  const containerStyle = StyleSheet.flatten([
    styles.NoteCard,
    { backgroundColor: theme.card, borderColor: theme.border },
    numColumns > 1 && { flex: 1, marginHorizontal: 7, maxWidth: `${100 / numColumns}%` as any }
  ]);
  const accentStyle = StyleSheet.flatten([styles.cardAccent, { backgroundColor: theme.accent }]);
  const titleStyle = StyleSheet.flatten([styles.NoteTitle, { color: theme.textPrimary }]);
  const descriptionStyle = StyleSheet.flatten([styles.NoteDescription, { color: theme.textSecondary }]);
  const footerStyle = StyleSheet.flatten([styles.cardFooter, { borderTopColor: theme.border }]);
  const dateStyle = StyleSheet.flatten([styles.NoteDate, { color: theme.textSecondary }]);
  const idStyle = StyleSheet.flatten([styles.cardID, { color: theme.textSecondary }]);

  return (
    <Pressable
      onPress={handleClick}
      style={containerStyle}
    >
      <View style={accentStyle} />

      <View style={styles.NoteTop}>
        <View style={{ flex: 1 }}>
          <Text style={titleStyle}>
            {data.title}
          </Text>

          {!!data.description && (
            <Text style={descriptionStyle}>
              {data.description}
            </Text>
          )}
        </View>
      </View>

      <View style={footerStyle}>
        <Text style={dateStyle}>
          {data.createdOn.toDateString()}
        </Text>

        <Text style={idStyle}>
          #{String(data.id + 1).padStart(3, "0")}
        </Text>
      </View>
    </Pressable>
  );
}

function NoteEditor({ toUpdateIndex, showEditor, Notes, setNotes, theme }: { toUpdateIndex: number; showEditor: Function; Notes: Note[]; setNotes: Function; theme: typeof themes.dark }) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string | undefined>();
  const [createdOn, setCreatedOn] = useState<Date>(new Date());

  const TEXTURES = {
    light: "https://images.unsplash.com/photo-1640995810429-5785ca363fc5?w=800&q=60",
    dark: "https://images.unsplash.com/photo-1585314062604-1a357de8b000?w=800&q=60",
  };

  useEffect(() => {
    if (toUpdateIndex > -1) {
      setTitle(Notes[toUpdateIndex].title);
      setDescription(Notes[toUpdateIndex].description);
      setCreatedOn(Notes[toUpdateIndex].createdOn);
    }
  }, []);

  const bgStyle = StyleSheet.flatten([styles.editorBG, { backgroundColor: theme.background }]);
  const topBarStyle = StyleSheet.flatten([styles.editorTopBar, { borderBottomColor: theme.border }]);
  const titleStyle = StyleSheet.flatten([styles.modalTitle, { color: theme.textPrimary }]);
  const closeBtnStyle = StyleSheet.flatten([styles.closeBtn, { color: theme.textSecondary }]);
  const titleInputStyle = StyleSheet.flatten([styles.textarea, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textPrimary }]);
  const descInputStyle = StyleSheet.flatten([styles.textarea, styles.descriptionBox, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textPrimary }]);
  const metaPanelStyle = StyleSheet.flatten([styles.metaPanel, { borderLeftColor: theme.accent }]);
  const createdTextStyle = StyleSheet.flatten([styles.createdText, { color: theme.textSecondary }]);
  const saveBtnStyle = StyleSheet.flatten([styles.btn, { backgroundColor: theme.accent, borderColor: theme.accentBorder }]);
  const deleteBtnStyle = StyleSheet.flatten([styles.btn, { backgroundColor: "transparent", borderColor: theme.border, marginTop: 14 }]);
  const deleteBtnTextStyle = StyleSheet.flatten([styles.btnText, { color: theme.textPrimary }]);

  return (
    <KeyboardAvoidingView
      style={bgStyle}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={{ uri: theme.background == "#050505" ? TEXTURES.dark : TEXTURES.light }}
        contentFit="cover"
        style={styles.modalCard}
      >
        <View style={{ flex: 1 }}>
          <View style={topBarStyle}>
            <Text style={titleStyle}>
              {toUpdateIndex > -1 ? "MODIFY ENTRY" : "NEW ENTRY"}
            </Text>

            <Pressable onPress={() => showEditor(false)}>
              <Text style={closeBtnStyle}>{"<"} BACK</Text>
            </Pressable>
          </View>

          <TextInput
            placeholder="TITLE"
            placeholderTextColor={theme.textSecondary}
            style={titleInputStyle}
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            placeholder="DESCRIPTION"
            placeholderTextColor={theme.textSecondary}
            multiline
            style={descInputStyle}
            value={description}
            onChangeText={setDescription}
          />

          <View style={metaPanelStyle}>
            <Text style={createdTextStyle}>
              CREATED: {createdOn.toDateString()}
            </Text>
          </View>

          <Pressable
            style={saveBtnStyle}
            onPress={() => {
              if (toUpdateIndex > -1) {
                setNotes((prev: Note[]) =>
                  prev.map((note, index) =>
                    index === toUpdateIndex
                      ? { ...note, title, description, createdOn }
                      : note
                  )
                );
              } else {
                if (title.trim() === "") {
                  alert("Please enter a title for the note.");
                  return;
                }
                setNotes((prev: Note[]) => [
                  ...prev,
                  {
                    id: prev.length,
                    title,
                    description,
                    createdOn,
                  },
                ]);
              }

              showEditor(false);
            }}
          >
            <Text style={styles.btnText}>SAVE</Text>
          </Pressable>

          {toUpdateIndex !== -1 && (
            <Pressable
              onPress={() => {
                setNotes(Notes.filter((item) => item.id != toUpdateIndex).map((item, index) => ({ ...item, id: index })));
                showEditor(false);
              }}
              style={deleteBtnStyle}
            >
              <Text style={deleteBtnTextStyle}>DELETE</Text>
            </Pressable>
          )}
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default function Index() {
  const [showEditorView, setShowEditorView] = useState<boolean>(false);
  const [toUpdateIndex, setToUpdateIndex] = useState<number>(-1);
  const [themeOverride, setThemeOverride] = useState<"light" | "dark" | "system">("system");
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const isDark = themeOverride === "system" ? colorScheme === "dark" : themeOverride === "dark";
  const theme = isDark ? themes.dark : themes.light;
  const numColumns = width > 1024 ? 3 : width > 600 ? 2 : 1;

  const [Notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState(Notes);
  const [filterQuery, setFilterQuery] = useState("");

  useEffect(() => {
    setFilteredNotes(Notes.filter((item) => item.title.toLowerCase().startsWith(filterQuery.toLowerCase())));
  }, [filterQuery, Notes]);

  const toggleTheme = () => {
    setThemeOverride((prev) => (prev === "system" ? "light" : prev === "light" ? "dark" : "light"));
  };

  const safeAreaStyle = StyleSheet.flatten([styles.container, { backgroundColor: theme.background }]);
  const headerStyle = StyleSheet.flatten([styles.header, { maxWidth: width > 1200 ? 1200 : ("100%" as DimensionValue) }]); // the as DimnensionValue is needed to prevent a weird bug where it thinks the type is number and not string | number, even tho it clearly is both
  const headingStyle = StyleSheet.flatten([styles.heading, { color: theme.textPrimary }]);
  const searchInputStyle = StyleSheet.flatten([styles.searchTextarea, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.textPrimary }]);
  const addBtnStyle = StyleSheet.flatten([styles.addBtn, { backgroundColor: theme.accent, borderColor: theme.accentBorder }]);
  const listStyle = StyleSheet.flatten([styles.NoteList, { maxWidth: width > 1200 ? 1200 : ("100%" as DimensionValue) }]);
  const listContentStyle = StyleSheet.flatten([{ paddingBottom: 120 }, numColumns > 1 ? { paddingHorizontal: 7 } : { paddingHorizontal: 14 }]);

  return (
    <SafeAreaView style={safeAreaStyle}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={theme.background} />

      <View style={headerStyle}>
        <View style={styles.headerTop}>
          <Text style={headingStyle}>NoteVault</Text>
          <View style={styles.headerRight}>
            {isDark ? <Text style={styles.themeToggleText}>🌙</Text> : <Text style={styles.themeToggleText}>☀️</Text>}
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        {!showEditorView && (
          <View style={styles.searchWrapper}>
            <TextInput
              placeholder="Search Notes..."
              placeholderTextColor={theme.textSecondary}
              style={searchInputStyle}
              value={filterQuery}
              onChangeText={setFilterQuery}
            />

            <Pressable
              style={addBtnStyle}
              onPress={() => {
                setToUpdateIndex(-1);
                setShowEditorView(true);
              }}
            >
              <Text style={styles.addBtnText}>+</Text>
            </Pressable>
          </View>
        )}
      </View>

      {!showEditorView ? (
        filteredNotes.length > 0 ? (
          <FlatList
            key={numColumns}
            data={filteredNotes}
            style={listStyle}
            contentContainerStyle={listContentStyle}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: "space-between" } : undefined}
            renderItem={({ item }) => (
              <NoteCard
                data={item}
                setEditor={setShowEditorView}
                setNote={setToUpdateIndex}
                theme={theme}
                numColumns={numColumns}
              />
            )}
            keyExtractor={(item) => item.createdOn.toISOString()}
          />) : (
          <View style={styles.emptyNoteList}>
            <Text style={styles.emptyNoteDescription}>
              No notes found. Create your first note!
            </Text>
          </View>
        )
      ) : (
        <View style={styles.editor}>
          <NoteEditor
            toUpdateIndex={toUpdateIndex}
            showEditor={setShowEditorView}
            Notes={Notes}
            setNotes={setNotes}
            theme={theme}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingHorizontal: 14,
    marginBottom: 14,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  emptyNoteList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyNoteDescription: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  headerRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  heading: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 3,
  },
  themeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
  },
  themeToggleText: {
    fontSize: 22,
    fontWeight: "700",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchTextarea: {
    flex: 1,
    height: 54,
    borderWidth: 2,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  addBtn: {
    width: 54,
    height: 54,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addBtnText: {
    color: "#111",
    fontSize: 30,
    fontWeight: "900",
    marginTop: -2,
  },
  NoteList: {
    width: "100%",
  },
  NoteCard: {
    position: "relative",
    borderWidth: 2,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  NoteTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  NoteTitle: {
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 10,
    flexShrink: 1,
  },
  NoteDescription: {
    lineHeight: 22,
    fontSize: 14,
  },
  cardFooter: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  NoteDate: {
    fontSize: 12,
    letterSpacing: 1,
  },
  cardID: {
    fontWeight: "800",
    letterSpacing: 2,
  },
  editor: {
    flex: 1,
    width: "100%",
  },
  editorBG: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modalCard: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 22,
    overflow: "hidden",
  },
  editorTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  closeBtn: {
    fontSize: 18,
    fontWeight: "900",
  },
  textarea: {
    width: "100%",
    minHeight: 54,
    borderWidth: 2,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  descriptionBox: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  metaPanel: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 20,
  },
  createdText: {
    fontSize: 13,
    letterSpacing: 1,
  },
  btn: {
    borderWidth: 2,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  btnText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
});