# Secure Communication Portal (Serverless)

A "Matrix-style" secure communication simulator built with React and Firebase.

## Features

- **Real-Time Chat**: Powered by Firebase Realtime Database.
- **Encryption Simulation**: Visual AES-256 encryption effects.
- **Crypto Lab**: Interactive educational tools for learning about cryptography.
- **Geolocator**: Simulated tracking interface.

## How to Run

1.  Navigate to the client directory:

    ```bash
    cd client
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  **Configure Firebase**:

    - Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
    - Copy your web app configuration.
    - Paste it into `src/firebase.js`.

4.  Start the application:
    ```bash
    npm run dev
    ```

## Deployment

This project is ready for Vercel!

1.  Push to GitHub.
2.  Import the project in Vercel.
3.  Set the Root Directory to `client`.
4.  Deploy!
