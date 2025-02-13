//Functions related to Appwrite Database service (CRUD operations on collections: submissions, reels, tickets, etc.)
import { ID, Query } from 'react-native-appwrite';
import { AppwriteClientFactory } from '../appwrite/appwriteClient';
import * as constants from '../../constants/appConstants';

const database = AppwriteClientFactory.getInstance().database

const appwriteDataBaseService = {
    createDocument: async (collectionId: string, data: object) => {
        try {
            return await database.createDocument(
                constants.DATABASE_ID,
                collectionId,
                ID.unique(),
                data
            );
        } catch (error) {
            console.error(`Appwrite Database Create Document Error in collection ${collectionId}`, error);
            throw error;
        }
    },

    getDocument: async (collectionId: string, documentId: string) => {
        try {
            return await database.getDocument(
                constants.DATABASE_ID,
                collectionId,
                documentId
            );
        } catch (error) {
            console.error(`Appwrite Database Get Document Error in collection ${collectionId} document ${documentId}`, error);
            throw error;
        }
    },

    listDocuments: async (collectionId: string, queries?: string[]) => { // Optional queries parameter
        try {
            return await database.listDocuments(
                constants.DATABASE_ID,
                collectionId,
                queries // Use the provided queries, if any
            );
        } catch (error) {
            console.error(`Appwrite Database List Documents Error in collection ${collectionId}`, error);
            throw error;
        }
    },

    updateDocument: async (collectionId: string, documentId: string, data: object) => {
        try {
            return await database.updateDocument(
                constants.DATABASE_ID,
                collectionId,
                documentId,
                data
            );
        } catch (error) {
            console.error(`Appwrite Database Update Document Error in collection ${collectionId} document ${documentId}`, error);
            throw error;
        }
    },

    deleteDocument: async (collectionId: string, documentId: string) => {
        try {
            return await database.deleteDocument(
                constants.DATABASE_ID,
                collectionId,
                documentId
            );
        } catch (error) {
            console.error(`Appwrite Database Delete Document Error in collection ${collectionId} document ${documentId}`, error);
            throw error;
        }
    },

    listRadioStations: async () => {
        try {
            return await database.listDocuments(
                constants.DATABASE_ID,
                constants.RADIO_STATIONS_COLLECTION_ID,
                [Query.limit(100)] // Adjust limit as needed
            );
        } catch (error) {
            console.error("Appwrite Database List Radio Stations Error:", error);
            throw error;
        }
    },
};

export default appwriteDataBaseService;