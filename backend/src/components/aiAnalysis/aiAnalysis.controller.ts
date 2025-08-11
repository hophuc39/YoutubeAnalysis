import aiDetectorService from "../aiDetector/aiDetector.service";
import { analyzeAudio } from "../audio/audio.service";
import { captureVideoThumbnail } from "../thumbnail/thumbnail.service";

import { Request, Response } from "express";

export const analyzeVideo = async (req: Request, res: Response) => {
    const { url } = req.body;
    try {
        const thumbnailPath = await captureVideoThumbnail(url as string);
        const analyzeResult = await analyzeAudio(url as string);
        const result = await aiDetectorService.detectAiContent(analyzeResult.text);

        res.json({
            status: "success",
            message: "Video analyzed successfully",
            thumbnailPath,
            analyzeResult: result,
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to analyze video",
            error: error,
        });
    }
}