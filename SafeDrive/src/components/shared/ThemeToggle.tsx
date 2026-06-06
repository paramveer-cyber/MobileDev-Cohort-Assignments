import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function ThemeToggle() {
  const {
    themeMode,
    isAutoTheme,
    toggleManualTheme,
    setAutoTheme,
    theme,
    lux,
  } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);

  const isAndroid = Platform.OS === "android";

  if (!isAndroid) {
    return (
      <TouchableOpacity
        onPress={toggleManualTheme}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Ionicons
          name={themeMode === "dark" ? "sunny" : "moon"}
          size={22}
          color={theme.text}
        />
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Ionicons
          name={themeMode === "dark" ? "moon" : "sunny"}
          size={22}
          color={theme.text}
        />
        {isAutoTheme && (
          <View
            style={[styles.autoDot, { backgroundColor: theme.accentTertiary }]}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={[
              styles.menu,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.menuTitle, { color: theme.textSecondary }]}>
              THEME
            </Text>

            <View style={[styles.menuRow, { borderBottomColor: theme.border }]}>
              <View style={styles.menuRowLeft}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={18}
                  color={theme.text}
                />
                <Text style={[styles.menuRowLabel, { color: theme.text }]}>
                  Auto (Light Sensor)
                </Text>
              </View>
              <Switch
                value={isAutoTheme}
                onValueChange={(enabled) => {
                  setAutoTheme(enabled);
                }}
                trackColor={{ false: theme.border, true: theme.accent }}
                thumbColor={theme.surfaceRaised}
              />
            </View>

            {isAutoTheme && (
              <View
                style={[styles.luxRow, { borderBottomColor: theme.border }]}
              >
                <Text style={[styles.luxLabel, { color: theme.textSecondary }]}>
                  Current lux
                </Text>
                <Text
                  style={[styles.luxValue, { color: theme.accentTertiary }]}
                >
                  {lux}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setAutoTheme(false);
                toggleManualTheme();
                setMenuVisible(false);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuRowLeft}>
                <Ionicons
                  name={themeMode === "dark" ? "sunny-outline" : "moon-outline"}
                  size={18}
                  color={theme.text}
                />
                <Text style={[styles.menuRowLabel, { color: theme.text }]}>
                  Switch to {themeMode === "dark" ? "Light" : "Dark"}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  autoDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 16,
  },
  menu: {
    width: 260,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  menuTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  menuRowLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  luxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  luxLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  luxValue: {
    fontSize: 13,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
