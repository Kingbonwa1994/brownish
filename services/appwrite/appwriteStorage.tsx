import { ID, } from 'react-native-appwrite'; 
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; 
import { AppwriteClientFactory } from '@/services/appwrite/appwriteClient'; 

const storage = AppwriteClientFactory.getInstance().storage; 


const prepareNativeFile = async (asset: { uri: string | URL; fileSize: any; mimeType: any; }) => { // Keep prepareNativeFile within this module
    console.log("[prepareNativeFile] asset ==>", asset);
    try {
        const url = new URL(asset.uri);
        // Handle native file preparation
        return {
            name: url.pathname.split("/").pop()!,
            size: asset.fileSize,
            type: asset.mimeType,
            uri: url.href,
        };
    } catch (error) {
        console.error("[prepareNativeFile] error ==>", error);
        return Promise.reject(error);
    }
};


const uploadMedia = async (bucketId: string, asset: ImagePicker.ImagePickerAsset) => { // Modified to take bucketId and ImagePickerAsset
    try {
        if (!asset.uri) {
            throw new Error("No file selected in asset");
        }
        if (!bucketId) {
            throw new Error("Bucket ID is required for uploadMedia"); // Added bucketId check
        }

        const fileData = Platform.OS === "web" ? asset.file : await prepareNativeFile({
            uri: asset.uri,
            fileSize: asset.fileSize,
            mimeType: asset.mimeType,
        });

        const response = await storage.createFile(
            bucketId, // Use bucketId parameter
            ID.unique(),
            // @ts-ignore  (Typescript issue with react-native-appwrite SDK and File type)
            fileData
        );
        console.log("[file uploaded] ==>", response);

        const fileUrl = storage.getFileView(
            bucketId, // Use bucketId parameter
            response.$id // fileId
        );
        console.log("[file view url] ==>", fileUrl); // Log view URL for debugging - you might want to return this directly

        return fileUrl; // Return the fileView URL (or just fileId if you prefer URLs to be constructed in components)

    } catch (error) {
        console.error("[uploadMediaFile] error ==>", error); // Keep original error log message for consistency with other service functions
        throw error; // Re-throw to handle errors in components
    }
};


const pickAndUploadMedia = async (bucketId: string) => { // Modified to take bucketId
    try {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            // eslint-disable-next-line import/namespace
            mediaTypes: ImagePicker.MediaTypeOptions.All, // Allows both images and videos
            allowsEditing: true,
            aspect: [4, 3], // Optional, adjust as needed
            quality: 1, // Optional, adjust as needed
        });

        if (!pickerResult.canceled) {
            try {
                // Ensure pickerResult.assets is not undefined and has at least one asset
                if (pickerResult.assets && pickerResult.assets.length > 0) {
                    const uploadResult = await uploadMedia(bucketId, pickerResult.assets[0]); // Pass bucketId and asset to uploadMedia
                    console.log("Upload successful! URL:", uploadResult);
                    return uploadResult; // Return the URL so the caller can use it
                } else {
                    console.warn("No assets returned from image picker, but not cancelled."); // Log a warning, might be unexpected
                    return null; // Or handle as appropriate for your app - maybe throw error instead?
                }

            } catch (e) {
                console.error("Upload failed in pickAndUploadMedia:", e);
                throw e; // Re-throw the error for handling by the caller
            }
        }
        return null; // Return null if the user cancels the picker
    } catch (pickerError) {
        console.error("Error in pickAndUploadMedia:", pickerError); // Catch errors from ImagePicker.launchImageLibraryAsync
        throw pickerError; // Re-throw picker errors as well
    }
};


const appwriteStorageService = { // Update the exported service object
    uploadMediaFile: uploadMedia, // Use the refactored uploadMedia as uploadMediaFile
    getFileView: async (bucketId: any, fileId: any) => { // Keep getFileView if you need to fetch URLs separately sometimes
        try {
            return storage.getFileView(bucketId, fileId);
        } catch (error) {
            console.error(`Appwrite Storage Get File View Error in bucket ${bucketId}`, error);
            throw error;
        }
    },
    deleteFile: async (bucketId: any, fileId: any) => {
        try {
            return await storage.deleteFile(bucketId, fileId);
        } catch (error) {
            console.error(`Appwrite Storage Delete File Error in bucket ${bucketId}`, error);
            throw error;
        }
    },
    pickAndUploadMedia: pickAndUploadMedia, // Export pickAndUploadMedia function
};

export default appwriteStorageService;