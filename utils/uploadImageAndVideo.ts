import * as ImagePicker from "expo-image-picker";
import { ID } from "react-native-appwrite"; // Make sure path is correct
import { Platform } from "react-native";

import { Client, Storage } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // Your Appwrite endpoint from env variables
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your Appwrite project ID from env variables

const storage = new Storage(client)
async function uploadMedia(asset: { uri: string; assetId?: string | null | undefined; width?: number; height?: number; type?: "video" | "image" | "livePhoto" | "pairedVideo" | undefined; fileName?: string | null | undefined; fileSize?: number | undefined; exif?: Record<string, any> | null | undefined; base64?: string | null | undefined; duration?: number | null | undefined; mimeType?: string | undefined; pairedVideoAsset?: ImagePicker.ImagePickerAsset | null | undefined; file: any; }) {
  try {
    if (!asset.uri) {
      throw new Error("No file selected");
    }
   
    const fileData = Platform.OS === "web" ? asset.file : await prepareNativeFile({
        uri: asset.uri,
        fileSize: asset.fileSize,
        mimeType: asset.mimeType,
      });

    const response = await storage.createFile(
      process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!, // Ensure this env variable is set
      ID.unique(),
      fileData
    );

    const fileUrl = storage.getFileView(
      process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
      response.$id
    );

    return fileUrl;
  } catch (error) {
    console.error("[uploadMedia] error ==>", error);
    throw error; // Re-throw the error for handling by the caller
  }
}

async function prepareNativeFile(asset: { uri: string | URL; fileSize: any; mimeType: any; }) {
  try {
    const url = new URL(asset.uri);
    return {
      name: url.pathname.split("/").pop(),
      size: asset.fileSize,
      type: asset.mimeType,
      uri: url.href,
    };
  } catch (error) {
    console.error("[prepareNativeFile] error ==>", error);
    throw error;
  }
}


async function pickAndUploadMedia() {
  let pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All, // Allows both images and videos
    allowsEditing: true,
    aspect: [4, 3], // Optional, adjust as needed
    quality: 1, // Optional, adjust as needed
  });

  if (!pickerResult.canceled) {
    try {
        const uploadResult = await uploadMedia({
            ...pickerResult.assets[0],
            file: pickerResult.assets[0].file ?? null, // provide a default value if file is undefined
          });
      console.log("Upload successful! URL:", uploadResult);
      return uploadResult; // Return the URL so the caller can use it
    } catch (e) {
      console.error("Upload failed:", e);
      throw e; // Re-throw the error for handling by the caller
    }
  }
  return null; // Return null if the user cancels the picker
}


export { pickAndUploadMedia }; // Export the function for use in other components