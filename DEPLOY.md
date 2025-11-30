# Deployment Guide

This project is built with **Vite + React + TypeScript**. It is a static site that can be deployed easily to any modern web hosting provider.

## Prerequisites

1.  **Git Installed**: You need Git to manage your code. [Download Git Here](https://git-scm.com/downloads).
2.  **GitHub Account**: Ensure this project is pushed to a GitHub repository.
3.  **Cloud Provider Account**: Create a free account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).

---

## Step 0: Setup Git & GitHub

Since Git wasn't detected on your system, follow these steps first:

1.  **Install Git**: Download and install from the link above.
2.  **Initialize Repo**:
    Open your terminal in this project folder and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
3.  **Push to GitHub**:
    *   Create a new repository on [GitHub.com](https://github.com/new).
    *   Copy the commands shown under "…or push an existing repository from the command line".
    *   Run them in your terminal:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
        git branch -M main
        git push -u origin main
        ```

---

## Option 1: Vercel (Recommended)

Vercel is the creators of Next.js and provides zero-config support for Vite apps.

1.  **Log in** to your Vercel dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import** your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vercel should automatically detect `Vite`.
    *   **Root Directory**: `./` (default)
    *   **Build Command**: `npm run build` (default)
    *   **Output Directory**: `dist` (default)
5.  Click **Deploy**.

> **Note**: If you encounter 404 errors on refresh, create a `vercel.json` file in the root:
> ```json
> {
>   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
> }
> ```

---

## Option 2: Netlify

1.  **Log in** to your Netlify dashboard.
2.  Click **"Add new site"** -> **"Import from existing project"**.
3.  Connect to **GitHub** and select your repository.
4.  **Build Settings**:
    *   **Base directory**: (leave empty)
    *   **Build command**: `npm run build`
    *   **Publish directory**: `dist`
5.  Click **Deploy site**.

> **Note**: To fix 404 errors on refresh, create a `_redirects` file in the `public` folder with this content:
> ```
> /*  /index.html  200
> ```

---

## Manual Build (Local Preview)

To test the production build locally before deploying:

1.  Run the build command:
    ```bash
    npm run build
    ```
2.  Preview the build:
    ```bash
    npm run preview
    ```
3.  Open the URL shown (usually `http://localhost:4173`).
