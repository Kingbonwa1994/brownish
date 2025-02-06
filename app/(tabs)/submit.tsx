import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";

const SubmitTrackScreen = ({ isSubscribed }: { isSubscribed: boolean }) => {
    
    const [email, setEmail] = useState("");
    const [track, setTrack] = useState<string | null>(null);

    const radioStations = [
        { id: 1, name: "Radio 1", email: "radio1@example.com", frequency: "98.5 FM" },
        { id: 2, name: "Radio 2", email: "radio2@example.com", frequency: "101.2 FM" },
        { id: 3, name: "Radio 3", email: "radio3@example.com", frequency: "105.9 FM" },
        { id: 4, name: "Radio 4", email: "radio4@example.com", frequency: "89.7 FM" },
        { id: 5, name: "Radio 5", email: "radio5@example.com", frequency: "102.4 FM" },
        { id: 6, name: "Radio 6", email: "radio6@example.com", frequency: "94.3 FM" },
        { id: 7, name: "Radio 7", email: "radio7@example.com", frequency: "107.1 FM" },
        { id: 8, name: "Radio 8", email: "radio8@example.com", frequency: "96.8 FM" },
        { id: 9, name: "Radio 9", email: "radio9@example.com", frequency: "99.5 FM" },
        { id: 10, name: "Radio 10", email: "radio10@example.com", frequency: "103.7 FM" },
    ];

    const handleUpload = async () => {
        if (!isSubscribed) {
            Alert.alert("Subscription Required", "Stakeholders must subscribe to submit tracks.");
            return;
        }
        
        let result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
        if (!result.canceled) {
            setTrack(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!track) {
            Alert.alert("Error", "Please upload a track before submitting.");
            return;
        }
        
        Alert.alert("Success", "Track submitted successfully to radio stations.");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Submit Your Track</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="Your Email" 
                value={email} 
                onChangeText={setEmail} 
            />
            
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadText}>{track ? "Track Selected" : "Upload Track"}</Text>
            </TouchableOpacity>
            
            <Text style={styles.label}>Submitting to:</Text>
            {radioStations.map((station) => (
                <Text key={station.id} style={styles.emailText}>
                    {station.name} - {station.frequency} ({station.email})
                </Text>
            ))}
            
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit Track</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SubmitTrackScreen;

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
    input: {
        backgroundColor: "#202020",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        marginBottom: 10,
        color: "#e0e0e0",
    },
    uploadButton: {
        backgroundColor: "#42ba96",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    uploadText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
        color: "#9e9e9e",
    },
    emailText: {
        color: "#e0e0e0",
        fontSize: 14,
        marginBottom: 5,
    },
    submitButton: {
        backgroundColor: "#673ab7",
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