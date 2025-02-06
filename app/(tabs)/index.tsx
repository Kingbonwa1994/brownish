import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { signUp } from "../../lib/appwrite"; // Import the signup function
import { useRouter } from "expo-router";

const OnboardingScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"artist" | "stakeholder" | null>(null);
    const [additionalData, setAdditionalData] = useState<any>({});



    const router = useRouter();
    const handleOnboarding = async () => {
        if (!role) {
            Alert.alert("Error", "Please select a role.");
            return;
        }

        const result = await signUp(email, password, role, additionalData);
        if (result.success) {
            router.replace(role === "artist" ? "/(tabs)" : "/+not-found");
        } else {
            Alert.alert("Error", result.error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <Text style={styles.label}>Enter Email:</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />

            <Text style={styles.label}>Enter Password:</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

            <Text style={styles.label}>Select Role:</Text>
            <View style={styles.roleContainer}>
                <TouchableOpacity style={[styles.roleButton, role === "artist" && styles.selectedRole]} onPress={() => setRole("artist")}>
                    <Text style={styles.roleText}>Artist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.roleButton, role === "stakeholder" && styles.selectedRole]} onPress={() => setRole("stakeholder")}>
                    <Text style={styles.roleText}>Stakeholder</Text>
                </TouchableOpacity>
            </View>

            {role === "artist" && (
                <>
                    <Text style={styles.label}>Stage Name:</Text>
                    <TextInput style={styles.input} onChangeText={(text) => setAdditionalData({ ...additionalData, stage_name: text })} placeholder="Stage Name" />
                    
                    <Text style={styles.label}>Genre:</Text>
                    <TextInput style={styles.input} onChangeText={(text) => setAdditionalData({ ...additionalData, genre: text })} placeholder="Genre" />
                </>
            )}

            {role === "stakeholder" && (
                <>
                    <Text style={styles.label}>Company Name:</Text>
                    <TextInput style={styles.input} onChangeText={(text) => setAdditionalData({ ...additionalData, company_name: text })} placeholder="Company Name" />
                    
                    <Text style={styles.label}>Industry:</Text>
                    <TextInput style={styles.input} onChangeText={(text) => setAdditionalData({ ...additionalData, industry: text })} placeholder="Industry" />
                </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleOnboarding}>
                <Text style={styles.submitText}>Complete Sign-Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default OnboardingScreen;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
        color: "#555",
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
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
        backgroundColor: "#ddd",
        borderRadius: 8,
        alignItems: "center",
    },
    selectedRole: {
        backgroundColor: "#4CAF50",
    },
    roleText: {
        color: "#333",
        fontWeight: "bold",
    },
    submitButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
