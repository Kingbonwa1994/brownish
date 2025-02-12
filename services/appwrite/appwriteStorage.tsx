import React, { useState, useCallback } from 'react';
import { View, Button, Image, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppwriteClientFactory } from '@/services/appwrite/appwriteClient';

interface MediaUploaderProps {
    mediaTypeOptions: ImagePicker.MediaType;
    bucketId: string;
    onMediaUploaded?: (fileUrl: string, mediaType: 'image' | 'video') => void;
    buttonTitle?: string;
    showPreview?: boolean;
}

interface MediaUploaderState {
    mediaUrl: string | null;
    mediaType: 'image' | 'video' | null;
    uploading: boolean;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
    mediaTypeOptions,
    bucketId,
    onMediaUploaded,
    buttonTitle,
    showPreview = true
}) => {
    const [mediaUrl, setMediaUrl] = useState<MediaUploaderState['mediaUrl']>(null);
    const [mediaType, setMediaType] = useState<MediaUploaderState['mediaType']>(null);
    const [uploading, setUploading] = useState<MediaUploaderState['uploading']>(false);

    const uploadMediaFile = async (bucketId: string, asset: ImagePicker.ImagePickerAsset): Promise<{ href: string }> => {
        const storage = AppwriteClientFactory.getInstance().storage;

        try {
            // Fetch the asset to get a blob (this gives us the file size and other blob methods)
            const res = await fetch(asset.uri);
            const blob = await res.blob();

            // Create a file-like object with the required properties
            const file = {
                uri: asset.uri,
                name: asset.fileName || `upload_${Date.now()}`,
                type: asset.type === 'image' ? 'image/jpeg' : 'video/mp4',
                size: blob.size,
                lastModified: Date.now(),
                webkitRelativePath: '', // you can leave this empty if not applicable

                // Bind the blob's methods so that they can be called later if required
                arrayBuffer: blob.arrayBuffer.bind(blob),
                slice: blob.slice.bind(blob),
                stream: blob.stream ? blob.stream.bind(blob) : () => { throw new Error('stream not supported'); },
                text: blob.text.bind(blob)
            } as unknown as File & { uri: string };

            // Now pass the file-like object to createFile
            const responseFile = await storage.createFile(bucketId, file.name, file);

            return { href: responseFile.$id };
        } catch (error) {
            console.error("Error uploading file to Appwrite:", error);
            throw new Error("Failed to upload media to Appwrite");
        }
    };

    const handleMediaPicked = useCallback(async (pickerResult: ImagePicker.ImagePickerResult) => {
        if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
            const asset = pickerResult.assets[0];
            let type: 'image' | 'video' | null = null;

            if (asset.type === 'image') {
                type = 'image';
            } else if (asset.type === 'video') {
                type = 'video';
            } else {
                alert("Unsupported media type selected.");
                return;
            }

            if (!bucketId) {
                alert("Bucket ID is not provided to MediaUploader.");
                return;
            }

            setUploading(true);
            try {
                const fileUrl = await uploadMediaFile(bucketId, asset);
                setMediaUrl(fileUrl.href);
                setMediaType(type);
                if (onMediaUploaded) {
                    onMediaUploaded(fileUrl.href, type);
                }
                alert(`${type.charAt(0).toUpperCase() + type.slice(1)} upload successful! 🎉`);
            } catch (error) {
                console.error("Media upload error:", error);
                alert("Media upload failed, sorry :(");
            } finally {
                setUploading(false);
            }
        }
    }, [bucketId, onMediaUploaded]);

    const pickMedia = useCallback(async () => {
        try {
            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: mediaTypeOptions,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.7,
            });

            handleMediaPicked(pickerResult);
        } catch (error) {
            console.error("Error launching image library:", error);
            alert("Error accessing media library.");
        }
    }, [mediaTypeOptions, handleMediaPicked]);

    return (
        <View style={styles.container}>
            <Button title={buttonTitle || "Pick Media"} onPress={pickMedia} disabled={uploading} />
            {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
            {showPreview && mediaUrl && mediaType === 'image' && (
                <Image source={{ uri: mediaUrl }} style={styles.mediaPreview} />
            )}
            {showPreview && mediaUrl && mediaType === 'video' && (
                <View style={styles.videoPlaceholder}>
                    <Text>Video Preview (Replace with Video Player)</Text>
                    <Text>URL: {mediaUrl}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    mediaPreview: {
        width: 200,
        height: 200,
        marginTop: 10,
    },
    videoPlaceholder: {
        width: 200,
        height: 200,
        marginTop: 10,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadingText: {
        marginTop: 5,
        fontStyle: 'italic',
        color: 'grey',
    },
});

export default MediaUploader;