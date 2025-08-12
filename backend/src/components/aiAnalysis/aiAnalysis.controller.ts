import aiDetectorService from "../aiDetector/aiDetector.service";
import { analyzeAudio } from "../audio/audio.service";
import { captureVideoThumbnail } from "../thumbnail/thumbnail.service";

import { Request, Response } from "express";
import { promises as fs } from "fs";
import path from "path";
import "dotenv/config";

export const analyzeVideo = async (req: Request, res: Response) => {
    const { url } = req.body;
    try {
        const thumbnailPath = await captureVideoThumbnail(url as string);
        const analyzeResult = await analyzeAudio(url as string);
        const result: { score: number, sentence_scores: { score: number, sentence: string }[] } = await aiDetectorService.detectAiContent(analyzeResult.text);

        const resultId = `anaylyze_${Date.now()}`;
        const jsonResult = JSON.stringify({
            id: resultId,
            overall_ai_probability: result.score,
            text: analyzeResult.text,
            sentences: result.sentence_scores.map((item) => ({
                ai_probability: item.score,
                sentence: item.sentence,
            })),
        });

        const resultsDir = process.env.DATA_STRORAGE_PATH + "/analysisResults";
        await fs.mkdir(resultsDir, { recursive: true });
        const filePath = path.join(resultsDir, `${resultId}.json`);
        await fs.writeFile(filePath, jsonResult, "utf-8");

        res.json({
            status: "success",
            message: "Video analyzed successfully",
            id: resultId,
            thumbnailPath: process.env.YOUTUBE_ANALYSIS_BASE_URL + "/thumbnails/" + thumbnailPath.split("/").pop(), // return only the filename
            analyzeResult: result,
        });
    } catch (error) {
        console.error(error); // log detailed error
        res.status(500).json({
            status: "error",
            message: "Failed to analyze video",
            error: error,
        });
    }
}

export const getAnalysisResult = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const filePath = process.env.DATA_STORAGE_PATH + "/analysisResults/" + `${id}.json`;
        const data = await fs.readFile(filePath, "utf-8");
        const result = JSON.parse(data);

        res.json({
            status: "success",
            message: "Analysis result retrieved successfully",
            result,
        });
    } catch (error) {
        res.status(404).json({
            status: "error",
            message: "Analysis result not found",
            error: error,
        });
    }
}