import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/markdown.sanitizer";
import { CreateProblemDto, UpdateProblemDto } from "../validators/problem.validator";

export interface IProblemService{
    createProblem(problem: Partial<IProblem>): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblem(): Promise<{ problems: IProblem[], total: number }>;
    updateProblem(id: string, problem: Partial<IProblem>): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]>;
    searchProblem(query: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService{
    
    private problemRepository: IProblemRepository;

    constructor(problemRepository: IProblemRepository){
        this.problemRepository = problemRepository;
    }

    async createProblem(problem: CreateProblemDto): Promise<IProblem> {
        const sanitizedPayload = {
            ...problem,
            description: await sanitizeMarkdown(problem.description),
            editorial: problem.editorial && await sanitizeMarkdown(problem.editorial)
        }
        return await this.problemRepository.createProblem(sanitizedPayload); 
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem) {
            throw new NotFoundError("Problem not found");
        }
        return problem;
    }

    async getAllProblem(): Promise<{ problems: IProblem[], total: number}> {
        return await this.problemRepository.getAllProblem();
    }

    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);

        if(!problem) {
            throw new NotFoundError("Problem not found");
        }

        const sanitizedPayload: Partial<IProblem> = {
            ...updateData
        }

        if(sanitizedPayload.description){
            sanitizedPayload.description = await sanitizeMarkdown(sanitizedPayload.description);
        }

        if(sanitizedPayload.editorial){
            sanitizedPayload.editorial = await sanitizeMarkdown(sanitizedPayload.editorial);
        }

        return await this.problemRepository.updateProblem(id, sanitizedPayload);
    }

    async deleteProblem(id: string): Promise<boolean> {
        const result = await this.problemRepository.deleteProblem(id);
        if(!result) {
            throw new NotFoundError("Problem not found");
        }
        return result;
    }

    async findByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]> {
        return await this.problemRepository.findByDifficulty(difficulty);
    }

    async searchProblem(query: string): Promise<IProblem[]> {
        if(!query || query.trim() === "") {
            throw new BadRequestError("Query is required");
        }
        return await this.problemRepository.searchProblem(query);
    }
}