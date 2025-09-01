import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
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
        // TODO sanitise markdown
        return await this.problemRepository.createProblem(problem); 
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

        // TODO sanitize markdown

        return await this.problemRepository.updateProblem(id, problem);
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