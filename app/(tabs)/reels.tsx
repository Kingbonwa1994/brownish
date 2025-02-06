import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import Video from "react-native-video";

const { width, height } = Dimensions.get("window");


const videos = [
    { id: 1, uri: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", artist: "Artist 1", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 2, uri: "https://www.sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", artist: "Artist 2", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 3, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", artist: "Artist 3", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 4, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", artist: "Artist 4", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 5, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", artist: "Artist 5", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 6, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", artist: "Artist 6", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 7, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", artist: "Artist 7", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 8, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", artist: "Artist 8", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 9, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", artist: "Artist 9", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 10, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", artist: "Artist 10", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 11, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4", artist: "Artist 11", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 12, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", artist: "Artist 12", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 13, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", artist: "Artist 13", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" },
    { id: 14, uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", artist: "Artist 14", spotify: "spotify-link", appleMusic: "apple-music-link", youtube: "youtube-link" }
];


const ExploreScreen = ({ isSubscribed }: { isSubscribed: boolean }) => {
    const router = useRouter();
    const videoRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleConnect = (link: string) => {
        if (!isSubscribed) {
            Alert.alert("Subscription Required", "You must be subscribed to connect with stakeholders.");
            return;
        }
        Linking.openURL(link);
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item, index }: any) => (
        <View style={styles.videoContainer}>
            <Video
                source={{ uri: item.uri }}
                style={styles.video}
                resizeMode="cover"
                repeat={true}
                paused={index !== currentIndex}
                ref={videoRef}
            />
            <View style={styles.overlay}>
                <Text style={styles.artistName}>{item.artist}</Text>
                <View style={styles.socialLinks}>
                    <TouchableOpacity onPress={() => handleConnect(item.spotify)}>
                        <FontAwesome5 name="spotify" size={24} color="#1DB954" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleConnect(item.appleMusic)}>
                        <FontAwesome5 name="apple" size={24} color="#FC3C44" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleConnect(item.youtube)}>
                        <FontAwesome5 name="youtube" size={24} color="#FF0000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Behind the Screens</Text>
                <TouchableOpacity onPress={() => Alert.alert("Search", "Search functionality not implemented")}>
                    <FontAwesome5 name="search" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={videos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                pagingEnabled
                horizontal={false}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            {!isSubscribed && (
                <TouchableOpacity style={styles.subscribeButton} onPress={() => Alert.alert("Subscribe", "Navigate to subscription page")}>
                    <Text style={styles.subscribeText}>Subscribe to Connect</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#000",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#e0e0e0",
    },
    videoContainer: {
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
    },
    video: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        position: "absolute",
        bottom: 50,
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    artistName: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    socialLinks: {
        flexDirection: "row",
        gap: 20,
    },
    subscribeButton: {
        backgroundColor: "#673ab7",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        margin: 20,
    },
    subscribeText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});