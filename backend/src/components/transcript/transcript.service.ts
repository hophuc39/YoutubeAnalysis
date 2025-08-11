import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import * as fs from "fs";
import "dotenv/config";

class TransciptService {
    private elevenLabs: ElevenLabsClient;

    constructor() {
        const apiKey = process.env.ELEVENLABS_API_KEY || "";
        const maskedKey = apiKey ? apiKey.slice(0, 4) + "****" + apiKey.slice(-4) : "(empty)";
        console.log(`[TranscriptService] ElevenLabs API Key: ${apiKey}`);
        this.elevenLabs = new ElevenLabsClient({
            apiKey,
        });
    }

    async audioToTranscript(audioPath: string) {
        console.log("[TranscriptService] Start converting audio to transcript:", audioPath);
        const audioStream = fs.createReadStream(audioPath);
        console.log("[TranscriptService] Audio stream created.");
        const transcript = await this.elevenLabs.speechToText.convert({
            file: audioStream,
            modelId: "scribe_v1",
            tagAudioEvents: true,
            diarize: true,
        });
        console.log("[TranscriptService] Transcript conversion completed.");
        return transcript as any;
    }
}

const transcriptService = new TransciptService();

export default transcriptService;