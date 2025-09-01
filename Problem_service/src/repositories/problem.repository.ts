import { IProblem, Problem } from "../models/problem.model";

export interface IProblemRepository{
    createProblem(problem: Partial<IProblem>): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblem(): Promise<{ problems: IProblem[], total: number }>;
    updateProblem(id: string, problem: Partial<IProblem>): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<IProblem[]>;
    searchProblem(query: string): Promise<IProblem[]>;
}

export class ProblemRepository implements IProblemRepository{

    async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
        const newProblem = new Problem(problem);
        return await newProblem.save();
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        return await Problem.findById(id);
    }

    async getAllProblem(): Promise<{ problems: IProblem[]; total: number; }> {
        const problems = await Problem.find().sort({createdAt: -1});
        const total = await Problem.countDocuments();

        return {problems, total};
    }

    async updateProblem(id: string, problem: Partial<IProblem>): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(id, problem, {new: true}); 
        // By default it returns old document so adding new: true for updated document
    }

    async deleteProblem(id: string): Promise<boolean> {
        const result = await Problem.findByIdAndDelete(id);
        return result!==null;
    }

    async findByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]> {
        return await Problem.find({difficulty}).sort({createdAt: -1});
    }

    async searchProblem(query: string): Promise<IProblem[]> {
        const regex = new RegExp(query);
        return await Problem.find({ $or: [{ title: regex}, {description: regex}]}).sort({createdAt: -1});
    }
}