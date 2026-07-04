import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComicCard } from "../../components/ComicCard";
import { EmptyState } from "../../components/EmptyState";
import { PlayfulButton } from "../../components/PlayfulButton";
import { Squashable } from "../../components/Squashable";
import { useHabits } from "../../hooks/use-habits";
import { CheckIcon, FlameIcon, PlusIcon } from "../../lib/design/icons";
import { MascotSleepy } from "../../lib/design/mascots";
import { colors, fontFamily, radii, spacing } from "../../lib/design/theme";
import { isHabitCompletedToday, isHabitDueToday } from "../../lib/habits/due";

export default function TodayHabitsScreen() {
  const { habits, isLoading, completeHabitForToday, reloadHabits } =
    useHabits();

  useFocusEffect(
    useCallback(() => {
      reloadHabits();
    }, [reloadHabits]),
  );

  const todaysHabits = habits.filter(isHabitDueToday);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.paper }}
      edges={["top"]}
    >
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          gap: spacing.lg,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.display,
              fontSize: 32,
              color: colors.ink,
            }}
          >
            Today
          </Text>
          <Squashable onPress={() => router.push("/new")}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: radii.pill,
                backgroundColor: colors.yellow,
                borderWidth: 2.5,
                borderColor: colors.ink,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlusIcon size={22} />
            </View>
          </Squashable>
        </View>

        {isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={colors.ink} />
          </View>
        ) : todaysHabits.length === 0 ? (
          <EmptyState
            mascot={<MascotSleepy />}
            title="Nothing due today"
            subtitle="Add a habit or check back tomorrow."
          >
            <PlayfulButton
              label="Add a habit"
              tone="blue"
              icon={<PlusIcon color={colors.paper} size={18} />}
              onPress={() => router.push("/new")}
            />
          </EmptyState>
        ) : (
          <FlatList
            data={todaysHabits}
            keyExtractor={(habit) => habit.id}
            contentContainerStyle={{
              gap: spacing.md,
              paddingBottom: spacing.xl,
            }}
            renderItem={({ item: habit }) => {
              const completedToday = isHabitCompletedToday(habit);
              return (
                <Squashable onPress={() => router.push(`/habit/${habit.id}`)}>
                  <ComicCard
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.md,
                        flexShrink: 1,
                      }}
                    >
                      <Text style={{ fontSize: 30 }}>{habit.emoji}</Text>
                      <View style={{ gap: 2, flexShrink: 1 }}>
                        <Text
                          style={{
                            fontFamily: fontFamily.heading,
                            fontSize: 17,
                            color: colors.ink,
                          }}
                        >
                          {habit.name}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <FlameIcon size={16} />
                          <Text
                            style={{
                              fontFamily: fontFamily.body,
                              fontSize: 13,
                              color: colors.ink,
                              opacity: 0.7,
                            }}
                          >
                            {habit.streak} day streak
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Pressable
                      hitSlop={8}
                      disabled={completedToday}
                      onPress={() => completeHabitForToday(habit.id)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radii.pill,
                        borderWidth: 2.5,
                        borderColor: colors.ink,
                        backgroundColor: completedToday
                          ? colors.green
                          : colors.paper,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {completedToday && <CheckIcon size={18} />}
                    </Pressable>
                  </ComicCard>
                </Squashable>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
