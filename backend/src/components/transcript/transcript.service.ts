import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import * as fs from "fs";

class TransciptService {
    private elevenLabs: ElevenLabsClient;

    constructor() {
        this.elevenLabs = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY || "",
        });
    }

    async audioToTranscript(audioPath: string) {
        const audioStream = fs.createReadStream(audioPath);
        const transcript = await this.elevenLabs.speechToText.convert({
            file: audioStream,
            modelId: "scribe_v1",
            tagAudioEvents: true,
            diarize: true,
        });

        return transcript;
    }
}

const transcriptService = new TransciptService();

export default transcriptService;