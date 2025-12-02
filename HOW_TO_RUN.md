# How to Run: AI-Enabled Secure Communication Portal

This project is designed to run on **two separate systems** (or two terminals on one system) to demonstrate secure communication.

## Prerequisites

- **Node.js** (v18 or higher) installed on both systems.
- **Git** installed.

## Setup (Do this on BOTH systems)

1.  Open a terminal/command prompt.
2.  Navigate to the project folder: `cd mahesh`
3.  Install dependencies (if you haven't already):
    ```bash
    cd server
    npm install
    cd ../client
    npm install
    ```

## System 1: The Server (Command Center)

1.  Find the IP address of this computer.
    - Windows: Run `ipconfig` in terminal. Look for "IPv4 Address" (e.g., `192.168.1.5`).
2.  Start the server:
    ```bash
    cd server
    npm start
    ```
3.  The server is now running on port `3001`.

## System 2: The Client (Field Agent)

1.  Open `client/src/components/ChatInterface.jsx`.
2.  Find the line: `const socket = io('http://localhost:3001');`
3.  **Change `localhost` to the IP address of System 1** (e.g., `http://192.168.1.5:3001`).
    - _If running on the same computer, keep it as `localhost`._
4.  Start the client:
    ```bash
    cd client
    npm run dev -- --host
    ```
5.  Open the link shown in the terminal (e.g., `http://192.168.1.5:5173`) on your browser.

## Features to Demonstrate

1.  **Real-Time Chat**: Open the client on two devices (or two tabs). Messages appear instantly.
2.  **Encryption**: Notice the "AES-256" tag on messages. The server only sees encrypted text (simulated).
3.  **AI Threat Detection**:
    - Type a normal message: "Status report." -> **Safe**.
    - Type a threat: "I hate you and I will attack." -> **THREAT DETECTED**.
    - A red alert overlay will appear, and the message will be flagged.

## Troubleshooting

- **Firewall**: If devices can't connect, ensure Windows Firewall allows Node.js on Private Networks.
- **AI Loading**: The first time you run the server, it will download the AI model. This might take a minute. Check the server terminal for "AI Model Loaded!".
