import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
import * as fs from "fs";

export const audioToTranscript = async (audioPath: string) => {
    const elevenLabs = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY || "",
    });
    const audioStream = fs.createReadStream(audioPath);
    const transcript = await elevenLabs.speechToText.convert({
        file: audioStream,
        modelId: "scribe_v1",
        tagAudioEvents: true,
        diarize: true,
    });

    return transcript;
}