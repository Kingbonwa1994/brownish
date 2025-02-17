import React from "react";
import { Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, ScrollView, Alert } from "react-native";
import { Redirect } from "expo-router";
import { AntDesign} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/lib/global-provider";
import { login } from "@/lib/appwrite";



const { width } = Dimensions.get("window");
const SignInScreen = () => {
    // const { refetch, loading, isLogged } = useGlobalContext();
    // if (!loading && isLogged) return <Redirect href="/" />;
  
    const handleLogin = async () => {
      const result = await login();
      if (result) {
        // refetch();
      } else {
        Alert.alert("Error", "Failed to login");
      }
    };

    return (
        <SafeAreaView>
        <ScrollView style={styles.container} 
        contentContainerStyle={styles.scrollViewContent}>
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
                    <Text style={styles.heroSubtitle}>No.1 Song Submission platform in the entire planet</Text>
                 </LinearGradient>
            </ImageBackground>

            
            <TouchableOpacity style={styles.socialButton} onPress={handleLogin}>
                <LinearGradient
                    colors={["#4285F4", "#34A853"]}
                    style={styles.buttonGradient}
                >
                    <AntDesign name="google" size={24} color="#fff" />
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                </LinearGradient>
            </TouchableOpacity>
            
        </ScrollView>
        </SafeAreaView>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212"   
      },
    heroSection: {
        width: width,
        
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
    scrollViewContent: { // NEW STYLE
        flexGrow: 1, // Important: Makes the content fill the ScrollView
        justifyContent: 'center', // Vertically center content
        // alignItems: 'center',    // Horizontally center if needed
    },
});