import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import MediaUploader from "@/components/ui/MediaUploader";
import * as constants from "@/constants/appConstants";
import appwriteDataBase from "@/services/appwrite/appwriteDataBase";
import appwriteStorage from "@/services/appwrite/appwriteStorage";

interface RadioStation {
    $id: string;
    name: string;
    email: string;
    frequency: string;
}

interface SubmitScreenProps {
    isSubscribed: boolean; // Prop to indicate subscription status
}

const SubmitScreen: React.FC<SubmitScreenProps> = ({ isSubscribed }) => {
    const [email, setEmail] = useState("");
    const [artistName, setArtistName] = useState("");
    const [trackTitle, setTrackTitle] = useState("");
    const [trackInfo, setTrackInfo] = useState(""); 
    const [trackUrl, setTrackUrl] = useState<string | null>(null); 
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null); 
    const [selectedRadioStationIds, setSelectedRadioStationIds] = useState<string[]>([]); // Store selected station IDs (using Appwrite document IDs)
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [radioStations, setRadioStations] = useState<RadioStation[]>([]);
    const [isLoadingStations, setIsLoadingStations] = useState(false); 
    const [isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        loadRadioStations();
    }, []);

    const loadRadioStations = useCallback(async () => {
        setIsLoadingStations(true);
        try {
            const response = await appwriteDataBaseService.listRadioStations();
            if (response && response.documents) {
                setRadioStations(response.documents as RadioStation[]);
            } else {
                Alert.alert("Error", "Failed to load radio stations.");
            }
        } catch (error) {
            console.error("Error loading radio stations:", error);
            Alert.alert("Error", "Failed to load radio stations.");
        } finally {
            setIsLoadingStations(false);
        }
    }, []);

    const handleAvatarUpload = useCallback(async () => {
        try {
            const fileUrl = await appwriteStorageService.pickAndUploadMedia(constants.ALBUM_COVERS_BUCKET_ID);
            if (fileUrl) {
                setAvatarUrl(fileUrl.href);
                console.log("Avatar URL set:", fileUrl.href);
                Alert.alert("Upload Successful", "Avatar uploaded successfully!");
            } else {
                console.log("Avatar upload cancelled by user.");
            }
        } catch (error) {
            console.error("Avatar upload error:", error);
            Alert.alert("Upload Failed", "Failed to upload avatar.");
        }
    }, []);

    const handleTrackUpload = useCallback(async () => {
        try {
            const fileUrl = await appwriteStorageService.pickAndUploadMedia(constants.MUSIC_TRACKS_BUCKET_ID);
            if (fileUrl) {
                setTrackUrl(fileUrl.href);
                console.log("Track URL set:", fileUrl.href);
                Alert.alert("Upload Successful", "Track uploaded successfully!");
            } else {
                console.log("Track upload cancelled by user.");
            }
        } catch (error) {
            console.error("Track upload error:", error);
            Alert.alert("Upload Failed", "Failed to upload track.");
        }
    }, []);


    const toggleRadioStationSelection = useCallback((stationId: string) => {
        setSelectedRadioStationIds((prev) =>
            prev.includes(stationId) ? prev.filter(id => id !== stationId) : [...prev, stationId]
        );
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!isSubscribed) {
            Alert.alert("Subscription Required", "Stakeholders must subscribe to submit tracks.");
            return;
        }
        if (!trackUrl || !artistName || !trackTitle || !email || !avatarUrl || selectedRadioStationIds.length === 0) {
            Alert.alert("Error", "Please complete all fields, upload track and avatar, and select radio stations.");
            return;
        }

        setIsSubmitting(true);
        try {
            // ** Save submission data to Appwrite Database **
            await appwriteDataBaseService.createDocument(constants.SUBMISSIONS_COLLECTION_ID, { /* ... submission data ... */ });
    
            // ** After successful database save, trigger the email function **
            try {
                // Get email addresses of selected radio stations
                const selectedStationEmails = radioStations
                    .filter(station => selectedRadioStationIds.includes(station.$id))
                    .map(station => station.email);
    
                await appwriteFunctionsService.executeSubmitTrackEmailFunction(
                    selectedStationEmails,
                    trackTitle,
                    artistName
                );
                console.log("Submission email function triggered successfully.");
                Alert.alert("Success", "Track submitted and radio stations notified!"); // Update success alert message
            } catch (emailError) {
                console.error("Error triggering email function:", emailError);
                Alert.alert("Submission Partially Successful", "Track submitted, but email notification failed. Please contact support if needed."); // Indicate partial success
                // Consider logging this emailError more thoroughly for debugging - maybe send to error tracking service
            }
            // Reset form after successful submission (whether email function succeeds or fails - consider your UX)
            setEmail("");
            setArtistName("");
            setTrackTitle("");
            setTrackInfo("");
            setTrackUrl(null);
            setAvatarUrl(null);
            setSelectedRadioStationIds([]);
    
        } catch (dbError) { // Renamed to dbError for clarity
            console.error("Submission Database Error:", dbError);
            Alert.alert("Submission Failed", "Failed to submit track. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubscribed, trackUrl, artistName, trackTitle, email, avatarUrl, selectedRadioStationIds, radioStations]); // Add radioStations to dependencies (important for email retrieval)

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Submit Your Track</Text>

            <TextInput style={styles.input} placeholder="Your Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Artist Name" value={artistName} onChangeText={setArtistName} />
            <TextInput style={styles.input} placeholder="Track Title" value={trackTitle} onChangeText={setTrackTitle} />
   


            <Text style={styles.label}>Upload Artist Avatar</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleAvatarUpload}>
                <Text style={styles.uploadText}>{avatarUrl ? "Change Avatar" : "Upload Artist Avatar"}</Text>
            </TouchableOpacity>
            {avatarUrl && <Image source={{ uri: avatarUrl }} style={styles.avatar} />}

            <Text style={styles.label}>Upload Track (Audio File)</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleTrackUpload}>
                <Text style={styles.uploadText}>{trackUrl ? "Change Track" : "Upload Track"}</Text>
            </TouchableOpacity>
            {trackUrl && <Text style={styles.uploadConfirmation}>Track Uploaded!</Text>}


            <TouchableOpacity style={styles.collapsibleHeader} onPress={() => setIsCollapsed(!isCollapsed)} disabled={isLoadingStations}>
                <Text style={styles.label}>Select Radio Stations:</Text>
                {isLoadingStations ? <Text style={styles.collapseIcon}>Loading...</Text> : <Text style={styles.collapseIcon}>{isCollapsed ? "▼" : "▲"}</Text>}
            </TouchableOpacity>
            {!isCollapsed && (
                <View>
                    {radioStations.map((station) => (
                        <TouchableOpacity
                            key={station.$id}
                            style={[styles.radioItem, selectedRadioStationIds.includes(station.$id) && styles.selected]}
                            onPress={() => toggleRadioStationSelection(station.$id)}
                            disabled={isLoadingStations}
                        >
                            <Text style={styles.radioText}>{station.name} - {station.frequency}</Text>
                        </TouchableOpacity>
                    ))}
                    {radioStations.length === 0 && !isLoadingStations && <Text style={styles.noStationsText}>No radio stations available.</Text>}
                </View>
            )}

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting || isLoadingStations} // Disable while submitting or loading stations
            >
                <Text style={styles.submitText}>{isSubmitting ? "Submitting..." : "Submit Track"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

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
    uploadButton: { // Style not directly used anymore, but kept for potential other buttons
        backgroundColor: "#42ba96",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20, // Not used for MediaUploader button by default
    },
    uploadText: { // Style not directly used anymore
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
    avatar: { // Style not directly used anymore
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: "center",
        marginBottom: 20, // Not used for MediaUploader preview
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
    collapsibleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    collapseIcon: {
        fontSize: 16,
        color: "#9e9e9e",
    },
    uploadConfirmation: {
        color: '#42ba96', // Green color for confirmation
        marginTop: 5,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    noStationsText: {
        color: '#9e9e9e',
        fontStyle: 'italic',
        marginTop: 5,
    },
});

export default SubmitScreen;