React Native Music Submission App with Appwrite Backend
Project Overview
This React Native application allows artists to submit their music tracks to a selection of radio stations.  It utilizes Appwrite as a backend for database storage, media file storage, user authentication, and serverless functions to automate email notifications to radio stations upon track submission.  This project demonstrates a full-stack mobile application architecture using modern technologies.

Technologies Used
React Native: For building cross-platform mobile applications (iOS and Android).
TypeScript: For enhanced code quality, type safety, and maintainability.
Expo: For a streamlined React Native development workflow, including easy setup, building, and deployment.
Appwrite:
Database: For storing application data (radio stations, submissions, user profiles, etc.).
Storage: For storing media files (music tracks, artist avatars).
Account API: For user authentication (artist and stakeholder accounts - although stakeholder auth is conceptual in current code).
Functions: For serverless backend logic (e.g., sending email notifications).
expo-image-picker: For accessing the device's media library to pick images and audio files.
react-native-appwrite: The Appwrite SDK for React Native to interact with the Appwrite backend.
Setup Instructions (Local Development)
Follow these steps to set up the project for local development:

Prerequisites
Node.js and npm (or yarn): Ensure you have Node.js and npm (Node Package Manager) or yarn installed on your development machine. You can download Node.js from nodejs.org. npm usually comes bundled with Node.js. Yarn can be installed via npm: npm install -g yarn.
Expo CLI: Install the Expo command-line interface globally: npm install -g expo-cli or yarn global add expo-cli.
Appwrite Account: Create an account on Appwrite Cloud or self-host Appwrite.
Appwrite Project: Create a new project in your Appwrite console.
Installation
Clone the Repository:
Bash

git clone <repository_url>
cd <project_directory>
Install Dependencies:
Bash

npm install  # or yarn install
Environment Variables Configuration
Create .env.local file: In the root of your project, create a file named .env.local.

Add Appwrite Project Details: Open .env.local and add the following environment variables, replacing the placeholder values with your actual Appwrite project details:

Code snippet

EXPO_PUBLIC_APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT  # e.g., '[https://cloud.appwrite.io/v1](https://cloud.appwrite.io/v1)' for Appwrite Cloud
EXPO_PUBLIC_APPWRITE_PROJECT_ID=YOUR_APPWRITE_PROJECT_ID
EXPO_PUBLIC_APPWRITE_BUCKET_ID=YOUR_APPWRITE_STORAGE_BUCKET_ID # Bucket for general media uploads, adjust for specific buckets as needed.
EXPO_PUBLIC_APPWRITE_ENDPOINT: Your Appwrite endpoint URL. For Appwrite Cloud, this is typically https://cloud.appwrite.io/v1. If you are self-hosting, use your server's endpoint.
EXPO_PUBLIC_APPWRITE_PROJECT_ID: Your Appwrite Project ID. You can find this in your Appwrite project settings in the console.
EXPO_PUBLIC_APPWRITE_BUCKET_ID: (Initial Setup - For simplified media uploads) For initial setup and testing, you can use a single Appwrite Storage bucket for media uploads. Create a bucket in your Appwrite Storage console and put its ID here. For a production app, you would likely want to create separate buckets (e.g., album-covers, music-tracks) and manage bucket IDs in your constants/appConstants.ts file, as demonstrated in the code. If you are using separate buckets, you will need to update your constants/appConstants.ts file accordingly and might not directly use EXPO_PUBLIC_APPWRITE_BUCKET_ID.
Important:  Environment variables starting with EXPO_PUBLIC_ are accessible in your React Native JavaScript/TypeScript code in Expo.  Ensure you replace YOUR_... placeholders with your actual values from your Appwrite project.

Running the App
Start the Expo development server:
Bash

npx expo start  # or yarn start
Choose your platform: Expo CLI will provide a QR code in your terminal. You can:
Scan the QR code with the Expo Go app on your iOS or Android device (download Expo Go from the App Store or Google Play Store).
Run on a simulator/emulator: Follow the Expo CLI prompts to run on an iOS simulator or Android emulator if you have them set up.
Run on web browser: Expo also allows you to run your app in a web browser for development, although some native features might not be fully available.
Project Structure
The project follows a typical React Native structure with a focus on separation of concerns:

project-root/
├── assets/                  # Application assets (images, fonts, etc.)
├── components/              # Reusable React components
│   └── ui/                # General UI components (e.g., MediaUploader)
├── constants/               # Constant values (Appwrite IDs, API keys, etc.)
│   └── appConstants.ts    # Centralized constants
├── services/                # Services for interacting with backend APIs
│   └── appwrite/          # Appwrite specific services
│       ├── appwriteClient.ts      # Appwrite client initialization (singleton)
│       ├── appwriteDataBase.ts    # Service for Appwrite Database operations
│       ├── appwriteStorage.ts     # Service for Appwrite Storage operations (media uploads)
│       ├── appwriteAccountService.ts # Service for Appwrite Account API
│       └── appwriteFunctionsService.ts # Service for Appwrite Functions API
├── screens/                 # Application screens/views
│   └── SubmitScreen.tsx     # Example screen for submitting music tracks
├── App.tsx                # Main application component
├── app.json               # Expo app configuration file
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation (this file)
Appwrite Backend Configuration
To fully utilize this application, you need to configure your Appwrite backend:

Appwrite Project Setup: Ensure you have created an Appwrite project.
Database and Collections:
Create a Database in your Appwrite project (if you haven't already).
Create the following Collections within your Database:
radioStations Collection:
Collection ID: (Set and use RADIO_STATIONS_COLLECTION_ID constant in constants/appConstants.ts)
Attributes:
name (String): Radio station name.
email (String): Radio station email address.
frequency (String): Radio frequency.
... (Add any other relevant attributes)
submissions Collection:
Collection ID: (Set and use SUBMISSIONS_COLLECTION_ID constant in constants/appConstants.ts)
Attributes:
trackTitle (String): Title of the submitted track.
artistName (String): Artist's name.
trackUrl (String): URL of the uploaded music1 track in Appwrite Storage.   
1.
github.com
github.com
avatarUrl (String): URL of the artist's avatar in Appwrite Storage.
radioStationIds (Document Array - String): Array of IDs of selected radio stations (from radioStations collection).
submissionDate (DateTime): Timestamp of submission.
artistId (String): User ID of the submitting artist (if you implement user authentication).
... (Add any other relevant attributes like trackInfo, etc.)
Storage Buckets:
Create the following Storage Buckets:
music-tracks Bucket:
Bucket ID: (Set and use MUSIC_TRACKS_BUCKET_ID constant in constants/appConstants.ts)
Purpose: Store uploaded music tracks.
album-covers Bucket:
Bucket ID: (Set and use ALBUM_COVERS_BUCKET_ID constant in constants/appConstants.ts)
Purpose: Store artist avatars/album covers.
(Optional) General Media Bucket: You might have an initial bucket (ID used in .env.local as EXPO_PUBLIC_APPWRITE_BUCKET_ID) for general media uploads during early development, or you can directly use the dedicated buckets.
Appwrite Function (for Email Notifications):
Create a Function in your Appwrite console.
Function ID: sendSubmissionEmails (Important: Must match the function ID used in appwriteFunctionsService.ts).
Runtime: Choose a suitable runtime (e.g., Node.js).
Code: Implement the function's logic to send email notifications to radio stations. This will typically involve:
Parsing the function payload (JSON data containing radio station emails, track details, artist name).
Using an email sending service (like Nodemailer, SendGrid, or similar) to send emails. You will need to configure API keys/credentials for your email service as environment variables in your Appwrite Function.
Permissions: Configure function permissions to allow authorized users (e.g., any logged-in user, or specific roles if you implement role-based access) to execute the function.
Deployment: Deploy your Appwrite Function.
Environment Variables (Function): If using an external email service, set up environment variables in your Appwrite Function configuration to securely store API keys or credentials for your email provider.
Key Features Implemented
Music Track Submission Form: A UI screen (SubmitScreen.tsx) allowing artists to input track details, upload an avatar and music track, and select radio stations to submit to.
Media Uploads: Utilizes MediaUploader component and appwriteStorageService to handle uploading artist avatars and music tracks to Appwrite Storage.
Radio Station Selection: Dynamically fetches radio stations from the radioStations collection in Appwrite Database and displays them for selection.
Data Persistence: Saves track submission data (track info, URLs, selected radio stations) to the submissions collection in Appwrite Database using appwriteDataBaseService.
Email Notifications (Backend Function): Implements an Appwrite Function (sendSubmissionEmails) that is triggered upon successful track submission to automatically send email notifications to the selected radio stations. ( Note: You need to implement the email sending logic within the Appwrite Function code itself).
User Account Service: Provides appwriteAccountService with functionalities for user account creation, login, logout, profile updates, and session management. (User authentication UI screens - LoginScreen, RegisterScreen, etc. - are conceptual examples and might need to be fully implemented).
Reusable Services: Employs a service-based architecture (services/appwrite) to encapsulate Appwrite API interactions, promoting code reusability and maintainability.
TypeScript: Built with TypeScript for type safety and improved developer experience.
Further Development
This project provides a solid foundation for a music submission application. Potential areas for further development include:

User Authentication: Implement full user authentication flows for artists and stakeholders (registration, login, logout, profile management, role-based access control if needed).
Stakeholder/Radio Station Features: Develop features specifically for stakeholders/radio station users, such as a dashboard to view submitted tracks, listen to tracks, manage their radio station profile, provide feedback, etc.
Payment Integration: Integrate payment gateways for subscription management (for stakeholders) or for artists to pay for submissions (if applicable).
Enhanced UI/UX: Improve the user interface and user experience, add more visual feedback, loading indicators, form validation, and polish the design.
Track Playback: Implement audio playback functionality to allow users (especially radio station stakeholders) to listen to submitted tracks directly within the app.
Advanced Appwrite Function Logic: Expand the Appwrite Function to include more sophisticated email content, error handling, logging, or integration with other backend services.
Testing: Implement unit and integration tests to ensure code quality and application stability.
Deployment: Prepare the application for deployment to app stores (Apple App Store and Google Play Store).
Contributing
Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes.  For major changes, please open an issue first to discuss what you would like to change.

Contact
For questions, issues, or suggestions related to this project, please contact:

[Bonwayinkosi Mdluli / OrbXCode]
[bonwamdluli@gmail.com / +27659505243]

Happy Coding!

```