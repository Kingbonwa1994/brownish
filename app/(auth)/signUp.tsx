import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Dimensions } from "react-native";
//import { signUp } from "../../lib/appwrite"; // Import the signup function
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"artist" | "stakeholder" | null>(null);
    const [additionalData, setAdditionalData] = useState<any>({});

    const router = useRouter();
    const { setUser } = useAuth();
  
    const handleOnboarding = () => {
      // Simulate a successful sign-up
      setUser({ id: 1, name: 'John Doe' });
      router.back(); // Close the modal and return to tabs
    };

    // const handleOnboarding = async () => {
    //     if (!role) {
    //         Alert.alert("Error", "Please select a role.");
    //         return;
    //     }

    //     const result = await signUp(email, password, role, additionalData);
    //     if (result.success) {
    //         router.replace(role === "artist" ? "/(tabs)" : "/+not-found");
    //     } else {
    //         Alert.alert("Error", result.error);
    //     }
    // };

    return (
        <ScrollView style={styles.container}>
            {/* Hero Section */}
            <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }} // Replace with your image URL
                style={styles.heroSection}
                imageStyle={{ borderRadius: 12 }}
            >
                <LinearGradient
                    colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.8)"]}
                    style={styles.heroOverlay}
                >
                    <Text style={styles.heroTitle}>Welcome to NORT</Text>
                    <Text style={styles.heroSubtitle}>Create an account</Text>
                </LinearGradient>
            </ImageBackground>

            <Text style={styles.title}>Sign Up</Text>

            <Text style={styles.label}>Enter Email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                placeholderTextColor="#9e9e9e"
            />

            <Text style={styles.label}>Enter Password:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#9e9e9e"
            />

            <Text style={styles.label}>Select Role:</Text>
            <View style={styles.roleContainer}>
                <TouchableOpacity
                    style={[styles.roleButton, role === "artist" && styles.selectedRole]}
                    onPress={() => setRole("artist")}
                >
                    <Text style={styles.roleText}>Artist</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, role === "stakeholder" && styles.selectedRole]}
                    onPress={() => setRole("stakeholder")}
                >
                    <Text style={styles.roleText}>Stakeholder</Text>
                </TouchableOpacity>
            </View>

            {role === "artist" && (
                <>
                    <Text style={styles.label}>Stage Name:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setAdditionalData({ ...additionalData, stage_name: text })}
                        placeholder="Stage Name"
                        placeholderTextColor="#9e9e9e"
                    />

                    <Text style={styles.label}>Genre:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setAdditionalData({ ...additionalData, genre: text })}
                        placeholder="Genre"
                        placeholderTextColor="#9e9e9e"
                    />
                </>
            )}

            {role === "stakeholder" && (
                <>
                    <Text style={styles.label}>Company Name:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setAdditionalData({ ...additionalData, company_name: text })}
                        placeholder="Company Name"
                        placeholderTextColor="#9e9e9e"
                    />

                    <Text style={styles.label}>Industry:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => setAdditionalData({ ...additionalData, industry: text })}
                        placeholder="Industry"
                        placeholderTextColor="#9e9e9e"
                    />
                </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleOnboarding}>
                <LinearGradient
                    colors={["#6a11cb", "#2575fc"]}
                    style={styles.buttonGradient}
                >
                    <Text style={styles.submitText}>Complete Sign-Up</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default OnboardingScreen;

// Styles
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
        width: width - 40, // Adjust width as needed
        height: 200, // Adjust height as needed
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#e0e0e0", // Light text color
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
        color: "#9e9e9e", // Slightly lighter text
    },
    input: {
        backgroundColor: "#202020", // Darker input background
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333", // Darker border
        marginBottom: 10,
        color: "#e0e0e0", // Light text color for input
    },
    roleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    roleButton: {
        flex: 1,
        padding: 12,
        marginHorizontal: 5,
        backgroundColor: "#333", // Darker button background
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,  // Add border for better visibility
        borderColor: "#444", // Slightly lighter border
    },
    selectedRole: {
        backgroundColor: "#42ba96", // Teal/Green selected color
        borderColor: "#42ba96", // Match border to background
    },
    roleText: {
        color: "#e0e0e0", // Light text color
        fontWeight: "bold",
    },
    submitButton: {
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 20,
    },
    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});