import React from 'react';
import { View, StyleSheet } from 'react-native';
import MediaUploader from '@/services/appwrite/appwriteStorage'; // Adjust the path as necessary
const MyScreen = () => {
    const handleMediaUploaded = (fileUrl: string, mediaType: 'image' | 'video') => {
        console.log('Media uploaded:', fileUrl, mediaType);
        // You can perform additional actions here, such as updating state or making API calls.
    };
    //define bucketid and link with environment variable
    const bucketId = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!

    return (
        <View style={styles.container}>
            <MediaUploader
                mediaTypeOptions= 'videos' 
                bucketId={bucketId}
                onMediaUploaded={handleMediaUploaded}
                buttonTitle="Upload Media"
                showPreview={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyScreen;