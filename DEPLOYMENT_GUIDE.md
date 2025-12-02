# Deployment Guide (Vercel)

This guide explains how to deploy your **Secure Communication Portal** to the web so anyone can access it.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account (Login with GitHub).
3.  Your `firebaseConfig` keys ready.

## Step 1: Push Code to GitHub

1.  Initialize Git in the project folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub (e.g., `secure-portal`).
3.  Push your code:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/secure-portal.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Deploy on Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `secure-portal` repository.
4.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: `client` (IMPORTANT: Click "Edit" and select the `client` folder).
5.  Click **Deploy**.

## Step 3: Verify

1.  Wait for the build to finish (approx. 1 minute).
2.  Click the **Domain** link provided by Vercel (e.g., `https://secure-portal.vercel.app`).
3.  Open it on your phone and laptop.
4.  **Success!** You now have a live, real-time secure chat app.

## Troubleshooting

- **White Screen?** Check the Console (F12) for errors.
- **Chat not working?** Ensure your Firebase Database rules are set to "Test Mode" (read/write: true).
