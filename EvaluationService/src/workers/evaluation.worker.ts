import { Worker } from "bullmq";
import { SUBMISSION_QUEUE } from "../utils/constants";
import logger from "../config/logger.config";
import { createNewRedisConnection } from "../config/redis.config";
import { EvaluationJob, EvaluationResult, TestCase } from "../interfaces/evaluation.interface";
import { runCode } from "../utils/containers/codeRunner.utils";
import { LANGUAGE_CONFIG } from "../config/language.config";
import { updateSubmission } from "../api/submission.api";

function matchTestCasesWithResults(testCases: TestCase[], results: EvaluationResult[]) {
    const output: Record<string, string> = {}
    if(results.length !== testCases.length) {
        console.log("WA");
        return;
    }
    testCases.map((testCase, index) => {
        let retval = "";
        if(results[index].status === "time_limit_exceeded") {
            retval = "TLE";
        } else if (results[index].status === "failed") {
            retval = "Error";
        } else {
            // match the output with the test case output
            if(results[index].output === testCase.output) {
                retval = "AC";
            } else {
                retval = "WA";
            }
        }

        console.log("retval", retval);
        output[testCase._id] = retval;
    });

    return output;
}

async function setupEvaluationWorker() {
    const worker = new Worker(SUBMISSION_QUEUE, async (job) => {
        logger.info(`Processing job ${job.id}`);
        
        const data: EvaluationJob = job.data;
        console.log("Data", data);
        console.log("Test Cases", data.problem.testCases);

        try {
            const testCaseRunnerPromises = data.problem.testCases.map(testCase => {
                return runCode({
                    code: data.code,
                    language: data.language,
                    timeout: LANGUAGE_CONFIG[data.language].timeout,
                    imageName: LANGUAGE_CONFIG[data.language].imageName,
                    input: testCase.input
                });
            });

            const testCaseRunnerResults = await Promise.all(testCaseRunnerPromises);

            console.log("Test Case Results", testCaseRunnerResults);

            const finalOutput = matchTestCasesWithResults(data.problem.testCases, testCaseRunnerResults);

            console.log("Final Output", finalOutput);

            await updateSubmission(data.submissionId, "completed", finalOutput || {});

        } catch (error) {
            logger.error(`Evaluation job failed: ${job}`, error);
            return;
        }

    }, {
        connection: createNewRedisConnection()
    });

    worker.on("error", (error) => {
        logger.error(`Evaluation worker error: ${error}`);
    });

    worker.on("completed", (job) => {
        logger.info(`Evaluation job completed: ${job}`);
    });

    worker.on("failed", (job, error) => {
        logger.error(`Evaluation job failed: ${job}`, error);
    });
}

export async function startWorkers() {
    await setupEvaluationWorker();
}