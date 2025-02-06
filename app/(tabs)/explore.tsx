import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Linking, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

const stakeholders = [
    { id: 1, name: "John Doe", role: "Music Producer", phone: "1234567890" },
    { id: 2, name: "Jane Smith", role: "Event Organizer", phone: "0987654321" },
];

const ExploreScreen = ({ isSubscribed }: { isSubscribed: boolean }) => {
    const router = useRouter();

    const handleConnect = (phone: string) => {
        if (!isSubscribed) {
            Alert.alert("Subscription Required", "You must be subscribed to connect with stakeholders.");
            return;
        }
        Linking.openURL(`https://wa.me/${phone}`);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Connect with Industry Stakeholders</Text>
            {stakeholders.map((stakeholder) => (
                <View key={stakeholder.id} style={styles.card}>
                    <FontAwesome5 name="user-tie" size={24} color="#fff" />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{stakeholder.name}</Text>
                        <Text style={styles.cardSubtitle}>{stakeholder.role}</Text>
                    </View>
                    <TouchableOpacity style={styles.whatsappButton} onPress={() => handleConnect(stakeholder.phone)}>
                        <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
                    </TouchableOpacity>
                </View>
            ))}
            {!isSubscribed && (
                <TouchableOpacity style={styles.subscribeButton} onPress={() => Alert.alert("Subscribe", "Navigate to subscription page")}> 
                    <Text style={styles.subscribeText}>Subscribe to Connect</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#e0e0e0",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
    },
    cardContent: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    cardSubtitle: {
        color: "#bbb",
        fontSize: 14,
    },
    whatsappButton: {
        padding: 10,
    },
    subscribeButton: {
        backgroundColor: "#673ab7",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    subscribeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
