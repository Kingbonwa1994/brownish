import React from "react";
import { Text, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const HomeScreen = () => {
    const router = useRouter();

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
                    <Text style={styles.heroSubtitle}>Your gateway to music, networking, and exclusive content</Text>
                </LinearGradient>
            </ImageBackground>

            {/* Music Submission Section */}
            <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)/submit")}>
                <LinearGradient
                    colors={["#6a11cb", "#2575fc"]}
                    style={styles.cardGradient}
                >
                    <MaterialIcons name="library-music" size={40} color="#fff" />
                    <Text style={styles.cardText}>Submit Music to Radio Stations</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Networking Section */}
            <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)/explore")}>
                <LinearGradient
                    colors={["#ff416c", "#ff4b2b"]}
                    style={styles.cardGradient}
                >
                    <FontAwesome5 name="users" size={40} color="#fff" />
                    <Text style={styles.cardText}>Connect with Industry Stakeholders</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Ticket Marketplace */}
            <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)/tickets")}>
                <LinearGradient
                    colors={["#00c6ff", "#0072ff"]}
                    style={styles.cardGradient}
                >
                    <MaterialIcons name="confirmation-number" size={40} color="#fff" />
                    <Text style={styles.cardText}>Buy & Sell Event Tickets</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Behind the Scenes Content */}
            <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)/reels")}>
                <LinearGradient
                    colors={["#f09819", "#edde5d"]}
                    style={styles.cardGradient}
                >
                    <FontAwesome5 name="video" size={40} color="#fff" />
                    <Text style={styles.cardText}>Watch Behind-the-Scenes Sessions</Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* Subscription Section */}
            <TouchableOpacity style={styles.card} onPress={() => router.push("/(tabs)")}>
                <LinearGradient
                    colors={["#673ab7", "#9c27b0"]}
                    style={styles.cardGradient}
                >
                    <MaterialIcons name="subscriptions" size={40} color="#fff" />
                    <Text style={styles.cardText}>Manage Your Subscription</Text>
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
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
    card: {
        borderRadius: 12,
        marginVertical: 10,
        overflow: "hidden",
    },
    cardGradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    cardText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 15,
        flex: 1,
    },
});