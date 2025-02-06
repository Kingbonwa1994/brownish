import { Client, Account, Databases, ID } from 'react-native-appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform('com.company.nort');

export const account = new Account(client);
export const databases = new Databases(client);

export const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string;
export const usersCollectionId = process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID as string;
export const artistsCollectionId = process.env.EXPO_PUBLIC_APPWRITE_ARTISTS_COLLECTION_ID as string;
export const stakeholdersCollectionId = process.env.EXPO_PUBLIC_APPWRITE_STAKEHOLDERS_COLLECTION_ID as string;
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
): Promise<{ success: boolean; user?: any; error?: string }> => {
  try {
    // Input Validation (Crucial!)
    if (!email || !password || !role || !additionalData) {
      return { success: false, error: "Missing required fields" };
    }
    if (!isValidEmail(email)) { // Implement isValidEmail
        return { success: false, error: "Invalid email format"};
    }

    // Step 1: Create User in Appwrite Auth (HASH PASSWORD HERE!)
    const user = await account.create(ID.unique(), email, password); // Password is hashed by appwrite

    // Step 1.5: Sign In (Optional, but often useful)
    await account.createEmailPasswordSession(email, password); // Sign the user in after creation

    const userId = user.$id;

    // Step 2: Add user to Users Collection
    await databases.createDocument(databaseId, usersCollectionId, userId, {
      user_id: userId,
      role: role,
      email: email,
      // DO NOT STORE PASSWORD.  It's already hashed by Appwrite auth.
      additional_data: JSON.stringify(additionalData),
    });

    // Step 3: Add user to their respective collection
    if (role === "artist") {
      const artistData = additionalData as ArtistData;
      await databases.createDocument(databaseId, artistsCollectionId, ID.unique(), {
        artist_id: userId, // Link back to the user
        stage_name: artistData.stage_name,
        genre: artistData.genre,
        social_links: JSON.stringify(artistData.social_links),
      });
    } else if (role === "stakeholder") {
      const stakeholderData = additionalData as StakeholderData;
      await databases.createDocument(databaseId, stakeholdersCollectionId, ID.unique(), {
        artist_id: userId, // Link back to the user
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

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

//