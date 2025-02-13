//(If used) Functions related to Appwrite Functions service (calling serverless functions).
import { Functions } from 'react-native-appwrite';

//instantiate functions

const functions = Functions


const appwriteFunctionsService = {
    executeSubmitTrackEmailFunction: async (
        radioStationEmails: string[],
        trackTitle: string,
        artistName: string
    ) => {
        try {
            const execution = await (functions as any).createExecution(
                'sendSubmissionEmails', //  Function ID -  Ensure this matches your Function ID in Appwrite console
                JSON.stringify({ // Pass data to the function as a JSON string
                    radioStationEmails,
                    trackTitle,
                    artistName,
                })
            );
            return execution; // Optionally return the execution object for tracking if needed
        } catch (error) {
            console.error("Appwrite Functions Execute sendSubmissionEmails Error:", error);
            throw error;
        }
    },

    // Add other function execution functions here as needed
    

};

export default appwriteFunctionsService;