# Firebase Setup Guide (Required for Phase 3)

To make the app work without a backend server (Serverless), you need to connect it to Firebase. It is **100% Free**.

## Step 1: Create a Firebase Project

1.  Go to [console.firebase.google.com](https://console.firebase.google.com/).
2.  Click **"Add project"**.
3.  Name it `secure-portal-demo`.
4.  Disable Google Analytics (not needed).
5.  Click **"Create project"**.

## Step 2: Create Realtime Database

1.  In the left sidebar, click **Build** -> **Realtime Database**.
2.  Click **"Create Database"**.
3.  Select a location (e.g., United States).
4.  **IMPORTANT**: Select **"Start in Test Mode"**.
    - This allows read/write access without login for 30 days (perfect for the demo).
5.  Click **Enable**.

## Step 3: Get Configuration Keys

1.  Click the **Gear Icon (Settings)** next to "Project Overview" in the top left.
2.  Select **Project settings**.
3.  Scroll down to "Your apps".
4.  Click the **Web icon (`</>`)**.
5.  Register app (Name: `client`).
6.  You will see a code block with `firebaseConfig`.

## Step 4: Connect to App

1.  Open `client/src/firebase.js` in your code editor.
2.  Replace the `firebaseConfig` object with the one you just copied.
    ```javascript
    const firebaseConfig = {
      apiKey: "AIzaSy...",
      authDomain: "...",
      // ...
    };
    ```
3.  Save the file.

## Step 5: Run the App

1.  Open terminal: `cd client`
2.  Run: `npm run dev`
3.  Open the link (e.g., `http://localhost:5173`).
4.  **Test**: Open it on your phone (connected to same Wi-Fi) using your laptop's IP address!
