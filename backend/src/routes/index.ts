import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import aiAnalysisRoute from "../components/aiAnalysis/aiAnalysis.route"
import path from "path";

const appRouter = express.Router();

const isProd = process.env.NODE_ENV === 'production';
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Youtube Analysis API', version: '1.0.0' },
    },
    apis: [path.join(__dirname, '../components/**/*.js')],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export const router = (app: express.Application) => {
    appRouter.use("/", aiAnalysisRoute);

    app.use("/api", appRouter);
    app.use("/thumbnails", express.static(process.env.DATA_STORAGE_PATH + "/thumbnails"));
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}