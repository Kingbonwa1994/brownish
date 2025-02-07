import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

// Placeholder authentication functions


const signInWithGoogle = async () => {
    console.log("Sign in with Google");
};

const signInWithApple = async () => {
    console.log("Sign in with Apple");
};

const signInWithMicrosoft = async () => {
    console.log("Sign in with Microsoft");
};

const SignInScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const { setUser } = useAuth();
    

    const handleSignIn = async () => {
        // if (!email || !password) {
        //     Alert.alert("Error", "Please enter your email and password.");
        //     return;
        // }

        // const result = await signIn(email, password);
        // if (result.success) {
        //     router.replace("/(tabs)");
        // } else {
        //     Alert.alert("Error", result.error);

        // }

        //simulate a successful login
        setUser({
            user_id: "123",
            role: "artist",
            email: "pWl2R@example.com",
            

        })
        router.back()
    };

    return (
        <ScrollView style={styles.container}>
            {/* Hero Section */}
            <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
                style={styles.heroSection}
                imageStyle={{ borderRadius: 12 }}
            >
                <LinearGradient
                    colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.8)"]}
                    style={styles.heroOverlay}
                >
                    <Text style={styles.heroTitle}>Welcome to NORT</Text>
                    <Text style={styles.heroSubtitle}>Sign in to access your account</Text>
                </LinearGradient>
            </ImageBackground>

            {/* Email and Password Input Fields */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9e9e9e"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9e9e9e"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                    <LinearGradient
                        colors={["#6a11cb", "#2575fc"]}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Social Sign-In Buttons */}
            <Text style={styles.socialSignInText}>Or sign in with</Text>
            <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle}>
                <LinearGradient
                    colors={["#4285F4", "#34A853"]}
                    style={styles.buttonGradient}
                >
                    <AntDesign name="google" size={24} color="#fff" />
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={signInWithApple}>
                <LinearGradient
                    colors={["#000000", "#2C2C2C"]}
                    style={styles.buttonGradient}
                >
                    <FontAwesome5 name="apple" size={24} color="#fff" />
                    <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={signInWithMicrosoft}>
                <LinearGradient
                    colors={["#00A4EF", "#0078D7"]}
                    style={styles.buttonGradient}
                >
                    <FontAwesome5 name="microsoft" size={24} color="#fff" />
                    <Text style={styles.socialButtonText}>Continue with Microsoft</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
        // Add these lines to center content:
        // justifyContent: 'center', // Vertically center
        // alignItems: 'center',     // Horizontally center
      },
    heroSection: {
        width: width - 40,
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
        overflow: "hidden",
    },
    heroOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    heroSubtitle: {
        fontSize: 16,
        color: "#e0e0e0",
        textAlign: "center",
        marginTop: 10,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#202020",
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        marginBottom: 10,
        color: "#e0e0e0",
    },
    signInButton: {
        borderRadius: 8,
        overflow: "hidden",
    },
    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    signInButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    socialSignInText: {
        fontSize: 16,
        color: "#9e9e9e",
        textAlign: "center",
        marginBottom: 10,
    },
    socialButton: {
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 10,
    },
    socialButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
});