import express from "express";
import * as aiAnalysisController from "./aiAnalysis.controller";

const aiAnalysisRouter = express.Router();

/**
 * @openapi
 * /api/analyze:
 *   post:
 *     summary: Analyze a YouTube video
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Analysis result
 */
aiAnalysisRouter.post("/analyze", aiAnalysisController.analyzeVideo);

export default aiAnalysisRouter;

