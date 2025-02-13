import { AppwriteClientFactory } from '@/services/appwrite/appwriteClient'

const account = AppwriteClientFactory.getInstance().account

const appwriteAccountService = {
    createAccount: async (email: string, password: string, name?: string) => {
        try {
            return await account.create(
                email,
                password,
                name ?? ""
            );
        } catch (error) {
            console.error("Appwrite Account Create Error:", error);
            throw error;
        }
    },

    createSession: async (email: string, password: string) => {
        try {
            return await account.createSession(
                email,
                password
            );
        } catch (error) {
            console.error("Appwrite Account Create Session Error:", error);
            throw error;
        }
    },

    deleteCurrentSession: async () => {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            console.error("Appwrite Account Delete Current Session Error:", error);
            throw error;
        }
    },

    getAccount: async () => {
        try {
            return await account.get();
        } catch (error) {
            console.error("Appwrite Account Get Account Error:", error);
            throw error;
        }
    },

    updateAccount: async (name?: string, password?: string, email?: string) => {
        try {
            // Update password if provided
            if (password) {
                return await account.updatePassword(password);
            }
            // Optionally update other details with their respective methods:
            // if (name) await account.updateName(name);
            // if (email) await account.updateEmail(email);
            throw new Error("No update parameter provided");
        } catch (error) {
            console.error("Appwrite Account Update Account Error:", error);
            throw error;
        }
    },

    getSessions: async () => {
        try {
            return await account.listSessions();
        } catch (error) {
            console.error("Appwrite Account Get Sessions Error:", error);
            throw error;
        }
    },

    // Add other account related functions as needed (e.g., getSession, deleteSession, etc.)

};

export default appwriteAccountService;