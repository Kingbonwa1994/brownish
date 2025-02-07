import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

const SubmitTrackScreen = ({ isSubscribed }: { isSubscribed: boolean }) => {
    const [email, setEmail] = useState("");
    const [artistName, setArtistName] = useState("");
    const [trackTitle, setTrackTitle] = useState("");
    const [trackInfo, setTrackInfo] = useState("");
    const [track, setTrack] = useState<string | null>(null);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [selectedStations, setSelectedStations] = useState<number[]>([]);

    const radioStations = [
        { id: 1, name: "Radio 1", email: "radio1@example.com", frequency: "98.5 FM" },
        { id: 2, name: "Radio 2", email: "radio2@example.com", frequency: "101.2 FM" },
        { id: 3, name: "Radio 3", email: "radio3@example.com", frequency: "105.9 FM" },
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

    const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        if (!track || !artistName || !trackTitle || !email) {
            Alert.alert("Error", "Please complete all fields and upload a track before submitting.");
            return;
        }
        
        Alert.alert("Success", "Track submitted successfully to selected radio stations.");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Submit Your Track</Text>
            
            <TextInput style={styles.input} placeholder="Your Email" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Artist Name" value={artistName} onChangeText={setArtistName} />
            <TextInput style={styles.input} placeholder="Track Title" value={trackTitle} onChangeText={setTrackTitle} />
            <TextInput style={styles.textArea} placeholder="Track Info" value={trackInfo} onChangeText={setTrackInfo} multiline />
            
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <Text style={styles.uploadText}>{avatar ? "Avatar Selected" : "Upload Artist Avatar"}</Text>
            </TouchableOpacity>
            {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
            
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadText}>{track ? "Track Selected" : "Upload Track"}</Text>
            </TouchableOpacity>
            
            <Text style={styles.label}>Select Radio Stations:</Text>
            {radioStations.map((station) => (
                <TouchableOpacity
                    key={station.id}
                    style={[styles.radioItem, selectedStations.includes(station.id) && styles.selected]}
                    onPress={() => setSelectedStations((prev) => prev.includes(station.id) ? prev.filter(id => id !== station.id) : [...prev, station.id])}
                >
                    <Text style={styles.radioText}>{station.name} - {station.frequency}</Text>
                </TouchableOpacity>
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
    textArea: {
        backgroundColor: "#202020",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        marginBottom: 10,
        color: "#e0e0e0",
        height: 80,
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
    radioItem: {
        backgroundColor: "#252525",
        padding: 10,
        borderRadius: 8,
        marginBottom: 5,
    },
    selected: {
        backgroundColor: "#673ab7",
    },
    radioText: {
        color: "#e0e0e0",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: "center",
        marginBottom: 20,
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
