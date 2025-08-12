import axios from "axios";
import "dotenv/config";

class AiDetectorService {
    private readonly aiDetectorApiUrl: string;
    private readonly aiDetectorApiKey: string;

    constructor() {
        this.aiDetectorApiUrl = process.env.AI_DETECTOR_API_URL || 'http://localhost:3000';
        this.aiDetectorApiKey = process.env.AI_DETECTOR_API_KEY || 'default';
    }

    async detectAiContent(text: string): Promise<any> {
        try {
            const response = await axios.post(`${this.aiDetectorApiUrl}/aidetect`, {
                key: this.aiDetectorApiKey, text,
            });

            if (response.status < 200 && response.status >= 300) {
                throw new Error(`Error detecting AI content: ${response.statusText}`);
            }

            const result = await response.data;
            return result;
        } catch (error) {
            console.error('AI Detector Service Error:', error);
            throw error;
        }
    }
}

const aiDetectorService = new AiDetectorService();

export default aiDetectorService;