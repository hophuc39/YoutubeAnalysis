import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import aiAnalysisRoute from "../components/aiAnalysis/aiAnalysis.route"

const appRouter = express.Router();

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Youtube Analysis API',
            version: '1.0.0',
        },
    },
    apis: ['./src/components/**/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export const router = (app: express.Application) => {
    appRouter.use("/", aiAnalysisRoute);

    app.use("/api", appRouter);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}