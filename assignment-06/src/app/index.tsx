// import * as Notifications from "expo-notifications";
// import { Button, View } from "react-native";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// async function example1_basic() {
//   await Notifications.scheduleNotificationAsync({
//     content: { title: "Welcome!", body: "This is your first notification." },
//     trigger: null,
//   });
// }

// async function example2_subtitle() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "New message",
//       subtitle: "From Alex", // 🍎 bold line under title | 🤖 shown as "subText"
//       body: "Are we still on for 5pm?",
//     },
//     trigger: null,
//   });
// }

// async function example3_data() {
//   console.log("Noti pushed...");
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Tap to open profile",
//       body: "Carries hidden data.",
//       data: { screen: "/profile", userId: 42 }, // 🤖🍎 not shown to user
//     },
//     trigger: null,
//   });
// }

// Notifications.addNotificationResponseReceivedListener((response) => {
//   const data = response.notification.request.content.data;
//   console.log(data?.screen); // "/profile"  🤖🍎
// });

// // With sound
// async function example4_sound() {
//   await Notifications.scheduleNotificationAsync({
//     content: { title: "Ding!", body: "Plays default sound.", sound: "default" },
//     trigger: null,
//   });
// }

// // Silent
// async function example4_silent() {
//   await Notifications.scheduleNotificationAsync({
//     content: { title: "Quiet", body: "No sound.", sound: false },
//     trigger: null,
//   });
// }

// async function example5_badge() {
//   await Notifications.setBadgeCountAsync(3); // 🍎 number on home-screen icon

//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "3 unread",
//       body: "Check the app icon.",
//       badge: 3, // 🍎
//     },
//     trigger: null,
//   });
// }

// async function clearBadge() {
//   await Notifications.setBadgeCountAsync(0); // 🤖🍎
// }

// async function example6_androidStyle() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Styled (Android)",
//       body: "Orange accent + custom vibration.",
//       color: "#FF6B35", // 🤖 accent color on the small icon
//       vibrate: [0, 500, 200, 500], // 🤖 vibration pattern (ms)
//     },
//     trigger: null,
//   });
// }
// async function example7_androidPriority() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Important (Android)",
//       body: "Pops up as a heads-up and stays put.",
//       priority: Notifications.AndroidNotificationPriority.HIGH, // 🤖
//       sticky: true, // 🤖 cannot be dismissed by swiping
//     },
//     trigger: null,
//   });
// }

// // Repeat every 60 seconds
// async function example12_repeat() {
//   await Notifications.scheduleNotificationAsync({
//     content: { title: "Drink water", body: "Stay hydrated!" },
//     trigger: {
//       type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//       seconds: 60,
//       repeats: false, // 🤖🍎  (🍎 requires seconds >= 60 when repeating)
//     },
//   });
// }
// // Cancel future scheduled notifications

// // Remove notifications already shown in the tray
// // Every day at 9:00 AM
// async function example12_daily() {
//   await Notifications.cancelAllScheduledNotificationsAsync(); // 🤖🍎
//   await Notifications.dismissAllNotificationsAsync(); // 🤖🍎
//   // await Notifications.scheduleNotificationAsync({
//   //   content: { title: "Good morning", body: "Daily reminder." },
//   //   trigger: {
//   //     type: Notifications.SchedulableTriggerInputTypes.DAILY, // 🤖🍎
//   //     hour: 2,
//   //     minute: 7,
//   //   },
//   // });
// }

// export default function Screen() {
//   return (
//     <View
//       style={{ padding: 40, display: "flex", flexDirection: "column", gap: 18 }}
//     >
//       <Button title="Send" onPress={example4_sound} />
//       <Button title="Set badge" onPress={example5_badge} />
//       <Button title="Clear Badge" onPress={clearBadge} />
//       <Button title="Haptic" onPress={example6_androidStyle} />
//       <Button title="Send High priority" onPress={example7_androidPriority} />
//       <Button title="Send Repeating" onPress={example12_repeat} />
//       <Button title="Send Repeating (daily)" onPress={example12_daily} />
//     </View>
//   );
// }
