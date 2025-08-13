# YoutubeAnalysis

## Setup
 - In `backend`:
   1. Install required packages:
      ```bash
      cd backend
      npm install
      ```
   2. Create a `.env` file from `.env.example` and fill in the required environment variables.
   3. Start the backend server:
      ```bash
      npm run dev
      ```

 - In `frontend`:
   1. Install required packages:
      ```bash
      cd frontend
      npm install
      ```
   2. Create a `.env` file from `.env.example` and fill in the required environment variables.
   3. Start the frontend app:
      ```bash
      npm run dev
      ```
 - (Optional) Run with Docker: 
    In the root folder, run: 
    ```bash
    docker-compose up -d --build
    ```

## Environment Variables
 - In `backend` folder, copy .env.example into .env with the data: 
    - YOUTUBE_ANALYSIS_BASE_URL (Backend base url)
    - ELEVENLABS_API_KEY (Your API Key to access Elevenlabs)
    - AI_DETECTOR_API_KEY (Yout API Key to access Sapling.ai)
    - AI_DETECTOR_API_URL=https://api.sapling.ai/api/v1
    - DATA_STORAGE_PATH=./data
 - In `frontend` folder, copy .env.example into .env with the data: 
    - VITE_API_URL (Backend base url)

## Design Decisions
 - Take Youtube thumbnail screeen shot: Using **Puppeteer** headless
 - Download audio track: Using **ytdl-mp3** to download audio as mp3, then convert into wav throught **fluent-ffmpeg**
 - Get the transcript with word-level timestamps and speaker diarisation: Connect and send data through **@elevenlabs/elevenlabs-js**
 - Send data to Sapling.ai to detect AI (not GPTZero since there wasn't any free plan from this platform for AI detector).
 - Deploy to Google Compute Engine VM at http://34.124.146.138:8080/ for backend and http://34.124.146.138:5000/ for frontend.