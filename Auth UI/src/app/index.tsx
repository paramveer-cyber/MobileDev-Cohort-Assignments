import React, { useState } from "react";
import { View, Image, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign, FontAwesome } from "@expo/vector-icons";

function SignIn({ setScreen }: any) {
  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Image source={require("@/assets/logo.png")} style={{ width: 75, height: 75 }} />
      </View>

      <Text style={{ fontSize: 34, fontWeight: "800", textAlign: "center", color: "#222" }}>
        Sign In
      </Text>

      <Text style={{ textAlign: "center", color: "#888", marginTop: 10, marginBottom: 28 }}>
        Let&apos;s experience the joy of telecare AI.
      </Text>

      <Text style={{ marginBottom: 10, fontWeight: "700" }}>
        Email Address
      </Text>

      <View style={{ height: 58, backgroundColor: "#F5F6F3", borderRadius: 18, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12, marginBottom: 18 }}>
        <Feather name="mail" size={18} color="#777" />

        <TextInput
          placeholder="Enter your email..."
          placeholderTextColor="#999"
          style={{ flex: 1 }}
        />
      </View>

      <Text style={{ marginBottom: 10, fontWeight: "700" }}>
        Password
      </Text>

      <View style={{ height: 58, backgroundColor: "#F5F6F3", borderRadius: 18, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12 }}>
        <Feather name="lock" size={18} color="#777" />

        <TextInput
          placeholder="Enter your password..."
          placeholderTextColor="#999"
          secureTextEntry
          style={{ flex: 1 }}
        />

        <Feather name="eye-off" size={18} color="#999" />
      </View>

      <Pressable style={{ backgroundColor: "#75E13F", height: 58, borderRadius: 18, justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 8, marginTop: 24 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          Sign In
        </Text>

        <Feather name="arrow-right" size={18} color="#fff" />
      </Pressable>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 14, marginTop: 28 }}>
        {[0, 1, 2].map((_, i) => (
          <Pressable key={i} style={{ width: 54, height: 54, borderRadius: 18, borderWidth: 1, borderColor: "#E5E5E5", justifyContent: "center", alignItems: "center" }}>
            {i === 0 && <FontAwesome name="facebook" size={18} color="#222" />}
            {i === 1 && <AntDesign name="google" size={18} color="#222" />}
            {i === 2 && <AntDesign name="instagram" size={18} color="#222" />}
          </Pressable>
        ))}
      </View>

      <Text style={{ textAlign: "center", marginTop: 24, color: "#888" }}>
        Don&apos;t have an account?{" "}
        <Text onPress={() => setScreen("signup")} style={{ color: "#75E13F", fontWeight: "700" }}>
          Sign Up
        </Text>
      </Text>

      <Text onPress={() => setScreen("forgot")} style={{ textAlign: "center", marginTop: 8, color: "#75E13F", fontWeight: "700" }}>
        Forgot your password?
      </Text>
    </>
  );
}

function SignUp({ setScreen }: any) {
  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Image source={require("@/assets/logo.png")} style={{ width: 75, height: 75 }} />
      </View>

      <Text style={{ fontSize: 34, fontWeight: "800", textAlign: "center", color: "#222" }}>
        Sign Up
      </Text>

      <Text style={{ textAlign: "center", color: "#888", marginTop: 10, marginBottom: 28 }}>
        Create your account in seconds.
      </Text>

      {["Email Address", "Password", "Confirm Password"].map((item, i) => (
        <View key={i}>
          <Text style={{ marginBottom: 10, fontWeight: "700" }}>
            {item}
          </Text>

          <View style={{ height: 58, backgroundColor: "#F5F6F3", borderRadius: 18, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12, marginBottom: 18 }}>
            <Feather name={i === 0 ? "mail" : "lock"} size={18} color="#777" />

            <TextInput
              placeholder={`Enter ${item.toLowerCase()}...`}
              placeholderTextColor="#999"
              secureTextEntry={i !== 0}
              style={{ flex: 1 }}
            />

            {i !== 0 && <Feather name="eye-off" size={18} color="#999" />}
          </View>
        </View>
      ))}

      <Pressable style={{ backgroundColor: "#75E13F", height: 58, borderRadius: 18, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          Sign Up
        </Text>
      </Pressable>

      <Text style={{ textAlign: "center", marginTop: 24, color: "#888" }}>
        Already have an account?{" "}
        <Text onPress={() => setScreen("signin")} style={{ color: "#75E13F", fontWeight: "700" }}>
          Sign In
        </Text>
      </Text>
    </>
  );
}

function Forgot({ setScreen }: any) {
  return (
    <>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <Image source={require("@/assets/logo.png")} style={{ width: 75, height: 75 }} />
      </View>

      <Text style={{ fontSize: 34, fontWeight: "800", textAlign: "center", color: "#222" }}>
        Forgot Password
      </Text>

      <Text style={{ textAlign: "center", color: "#888", marginTop: 10, marginBottom: 28 }}>
        Reset your password securely.
      </Text>

      <Text style={{ marginBottom: 10, fontWeight: "700" }}>
        Email Address
      </Text>

      <View style={{ height: 58, backgroundColor: "#F5F6F3", borderRadius: 18, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 12 }}>
        <Feather name="mail" size={18} color="#777" />

        <TextInput
          placeholder="Enter your email..."
          placeholderTextColor="#999"
          style={{ flex: 1 }}
        />
      </View>

      <Pressable style={{ backgroundColor: "#75E13F", height: 58, borderRadius: 18, justifyContent: "center", alignItems: "center", marginTop: 24 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          Reset Password
        </Text>
      </Pressable>

      <Text style={{ textAlign: "center", marginTop: 24, color: "#888" }}>
        Back to{" "}
        <Text onPress={() => setScreen("signin")} style={{ color: "#75E13F", fontWeight: "700" }}>
          Sign In
        </Text>
      </Text>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<"signin" | "signup" | "forgot">("signin");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EEF1EC", justifyContent: "center", paddingHorizontal: 20 }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 36, padding: 24, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
        {screen === "signin" && <SignIn setScreen={setScreen} />}
        {screen === "signup" && <SignUp setScreen={setScreen} />}
        {screen === "forgot" && <Forgot setScreen={setScreen} />}
      </View>
    </SafeAreaView>
  );
}