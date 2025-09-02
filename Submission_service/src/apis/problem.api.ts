import axios, { AxiosResponse } from "axios";
import logger from "../config/logger.config";
import { InternalServerError } from "../utils/errors/app.error";
import { serverConfig } from "../config";

export interface ITestCase {
    input: string;
    output: string;
}

export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testCases: ITestCase[];
}

export interface IProblemResponse {
    message: string,
    data: IProblemDetails,
    success: boolean
}

export async function getProblemByID(problemId: string): Promise<IProblemDetails | null> {
    try {
        const url = `${serverConfig.PROBLEM_SERVICE}/problem/${problemId}`;
        logger.info("Getting problem by ID", { url });
        // TODO: Improve the axios api error handling
        const response: AxiosResponse<IProblemResponse> = 
         await axios.get(url);

         if(response.data.success) {
            return response.data.data;
         }

         throw new InternalServerError("Failed to get problem details");
    } catch (error) {
        logger.error(`Failed to fetch problem details, ${error}`);
        return null;
    }
}