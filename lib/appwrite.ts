import { Client, Account, Databases, ID } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!) 
  .setPlatform('com.company.nort');

export const account = new Account(client);
export const databases = new Databases(client);

export const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string;
export const usersCollectionId = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID as string;
export const artistsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_ARTISTS_COLLECTION_ID  as string;
export const stakeholdersCollectionId = process.env.EXPO_PUBLIC_APPWRITE_STAKEHOLDERS_COLLECTION_ID as string;

//sign and onbording
interface ArtistData {
    stage_name: string;
    genre: string;
    social_links: Record<string, string>;
}

interface StakeholderData {
    company_name: string;
    industry: string;
    social_links: Record<string, string>;
}

export const signUp = async (
    email: string,
    password: string,
    role: "artist" | "stakeholder",
    additionalData: ArtistData | StakeholderData
) => {
    try {
        // Step 1: Create User in Appwrite Auth
        const user = await account.create(ID.unique(), email, password);
        const userId = user.$id;

        // Step 2: Add user to Users Collection
        await databases.createDocument(databaseId, usersCollectionId, userId, {
            email,
            role,
        });

        // Step 3: Add user to their respective collection
        if (role === "artist") {
            const artistData = additionalData as ArtistData;
            await databases.createDocument(databaseId, artistsCollectionId, "unique()", {
                user_id: userId,
                stage_name: artistData.stage_name,
                genre: artistData.genre,
                social_links: JSON.stringify(artistData.social_links),
            });
        } else if (role === "stakeholder") {
            const stakeholderData = additionalData as StakeholderData;
            await databases.createDocument(databaseId, stakeholdersCollectionId, "unique()", {
                user_id: userId,
                company_name: stakeholderData.company_name,
                industry: stakeholderData.industry,
                social_links: JSON.stringify(stakeholderData.social_links),
            });
        }
        return { success: true, user };
    } catch (error: any) {
        console.error("Signup Error:", error);
        return { success: false, error: error.message };
    }
};

//music submission and reel upload 

export const submitMusic = async (artistId: string, musicUrl: string) => {
    try {
        await databases.createDocument(databaseId, "music_submissions", ID.unique(), {
            artist_id: artistId,
            music_url: musicUrl,
            submitted_at: new Date().toISOString(),
        });
        return { success: true };
    } catch (error: any) {
        console.error("Music Submission Error:", error);
        return { success: false, error: error.message };
    }
};

export const uploadReel = async (artistId: string, reelUrl: string) => {
    try {
        await databases.createDocument(databaseId, "reels", ID.unique(), {
            artist_id: artistId,
            reel_url: reelUrl,
            uploaded_at: new Date().toISOString(),
        });
        return { success: true };
    } catch (error: any) {
        console.error("Reel Upload Error:", error);
        return { success: false, error: error.message };
    }
};
