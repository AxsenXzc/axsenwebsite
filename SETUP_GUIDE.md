# Installation Guide for Axsen Website

## Table of Contents
1. [Installation Guide](#installation-guide)
2. [Environment Setup](#environment-setup)
3. [Configuration Steps](#configuration-steps)
4. [Deployment Instructions for Netlify](#deployment-instructions-for-netlify)
5. [Troubleshooting Tips](#troubleshooting-tips)
6. [API Integration Documentation](#api-integration-documentation)

---

## Installation Guide

To set up the Axsen website project, follow the steps outlined below:

1. **Clone the Repository**  
   Use the command below to clone the repository to your local machine:
   ```bash
   git clone https://github.com/AxsenXzc/axsenwebsite.git
   cd axsenwebsite
   ```

2. **Install Dependencies**  
   Ensure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

## Environment Setup

To set up the environment correctly:

1. Create a `.env` file in the root directory.
2. Add the required environment variables. The structure of the `.env` file should resemble the following:
   ```
   API_URL=<your_api_url>
   NODE_ENV=development
   ```

## Configuration Steps

1. Configure relevant services and APIs in the `.env` file as needed for your environment.
2. Update any paths in the codebase that are necessary depending on your directory structure.

## Deployment Instructions for Netlify

1. Push your code to the remote repository.
2. Go to [Netlify](https://www.netlify.com/) and log in to your account.
3. Click on `New site from Git`.
4. Connect to your GitHub repository.
5. Configure the build settings:  
   - **Branch to deploy:** `main`  
   - **Build command:** `npm run build`  
   - **Publish directory:** `dist`
6. Click on `Deploy site` to start the deployment process. 

## Troubleshooting Tips

- If you encounter issues during installation, ensure all dependencies are correctly installed.
- Check console logs for specific errors and address those directly.

## API Integration Documentation

1. **Base URL:** The base URL of the API is defined in your `.env` file.
2. **Endpoints:**
   - **GET /api/data** - Fetches data.
   - **POST /api/data** - Sends data.
3. Refer to the OpenAPI documentation for detailed request and response formats.

For more specific integrations, follow the guidelines as per the API documentation available in the repository.

---