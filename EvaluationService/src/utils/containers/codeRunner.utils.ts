import { InternalServerError } from "../errors/app.error";
import { command } from "./command.utils";
import { createNewDockerContainer } from "./createContainer.util";

const allowedLanguagesList = ['python', 'cpp'];

export interface RunCodeOptions {
    code: string,
    language: 'python' | 'cpp',
    timeout: number, // in ms
    imageName: string,
    input: string
}

export async function runCode(options: RunCodeOptions) {

    const { code, language, timeout, imageName, input } = options;

    if(!allowedLanguagesList.includes(language)) {
        throw new InternalServerError('Language not supported');
    }

    const container = await createNewDockerContainer({
        imageName: imageName,
        cmdExecutable: command[language](code, input),
        memoryLimit: 1024 * 1024 * 1024
    })

    // let isTimeLimitExceeded = false;

    const timeLimitExceededTimeout = setTimeout(() => {
        console.log("Time limit exceeded");
        // isTimeLimitExceeded = true;
        container?.kill();
    }, timeout);

    await container?.start();

    const status = await container?.wait();

    // if(isTimeLimitExceeded) {
    //     await container?.remove();
    //     return {
    //         status: "time_limit_exceeded",
    //         output: "Time limit exceeded"
    //     }
    // }

    const logs = await container?.logs({
        stdout: true,
        stderr: true
    });
    console.log("Container logs", logs?.toString());

    await container?.remove();

    clearTimeout(timeLimitExceededTimeout);

    if(status.StatusCode == 0) {
        // success
        console.log("Code executed successfully");
    } else {
        console.log("Code execution failed");
    }
}