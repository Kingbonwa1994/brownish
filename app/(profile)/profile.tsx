import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Dimensions, ScrollView, Image, Alert } from "react-native";
import {  FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

const ProfileComponent = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [socialLinks, setSocialLinks] = useState(user?.socialLinks || { instagram: "", twitter: "", youtube: "" });

    const handleSaveProfile = () => {
        // Simulate saving profile data
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
    };

    const handleUploadVideo = () => {
        // Simulate video upload
        Alert.alert("Video Upload", "Video uploaded successfully!");
    };

    const handleSubscribe = () => {
        // Simulate subscription
        Alert.alert("Subscription", "You are now subscribed to premium content!");
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContent}>
            {/* Profile Header */}
            <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
                style={styles.profileHeader}
                imageStyle={{ borderRadius: 12 }}
            >
                <LinearGradient
                    colors={["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.8)"]}
                    style={styles.heroOverlay}
                >
                    <Image
                        source={{ uri: "https://via.placeholder.com/150" }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{user?.name || "Artist Name"}</Text>
                    <Text style={styles.profileRole}>{user?.role || "Artist"}</Text>
                </LinearGradient>
            </ImageBackground>

            {/* Edit Profile Section */}
            <View style={styles.section}>
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
                    <Feather name="edit" size={20} color="#fff" />
                    <Text style={styles.editButtonText}>{isEditing ? "Cancel Editing" : "Edit Profile"}</Text>
                </TouchableOpacity>

                {isEditing && (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            placeholderTextColor="#9e9e9e"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Bio"
                            placeholderTextColor="#9e9e9e"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Instagram"
                            placeholderTextColor="#9e9e9e"
                            value={socialLinks.instagram}
                            onChangeText={(text) => setSocialLinks({ ...socialLinks, instagram: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Twitter"
                            placeholderTextColor="#9e9e9e"
                            value={socialLinks.twitter}
                            onChangeText={(text) => setSocialLinks({ ...socialLinks, twitter: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="YouTube"
                            placeholderTextColor="#9e9e9e"
                            value={socialLinks.youtube}
                            onChangeText={(text) => setSocialLinks({ ...socialLinks, youtube: text })}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                            <LinearGradient
                                colors={["#6a11cb", "#2575fc"]}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Upload Video Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upload Video</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={handleUploadVideo}>
                    <MaterialIcons name="video-library" size={24} color="#fff" />
                    <Text style={styles.uploadButtonText}>Upload New Video</Text>
                </TouchableOpacity>
            </View>

            {/* Premium Subscription Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Premium Content</Text>
                <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                    <LinearGradient
                        colors={["#ff416c", "#ff4b2b"]}
                        style={styles.buttonGradient}
                    >
                        <FontAwesome5 name="crown" size={20} color="#fff" />
                        <Text style={styles.subscribeButtonText}>Subscribe to Premium</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#121212",
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    profileHeader: {
        width: width,
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
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
    },
    profileRole: {
        fontSize: 16,
        color: "#e0e0e0",
        textAlign: "center",
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#333",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    editButtonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
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
    saveButton: {
        borderRadius: 8,
        overflow: "hidden",
    },
    buttonGradient: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    uploadButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#333",
        padding: 15,
        borderRadius: 8,
    },
    uploadButtonText: {
        color: "#fff",
        fontSize: 16,
        marginLeft: 10,
    },
    subscribeButton: {
        borderRadius: 8,
        overflow: "hidden",
    },
    subscribeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
});