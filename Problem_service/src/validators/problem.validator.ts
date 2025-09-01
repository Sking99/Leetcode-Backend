import { z } from 'zod';

export const createProblemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    editorial: z.string().optional(),
    testCases: z.array(z.object({
        input: z.string().min(1, 'Test case input is required'),
        output: z.string().min(1, 'Test case output is required')
    }))
});

export const updateProblemSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']).optional(),
    editorial: z.string().optional(),
    testCases: z.array(z.object({
        input: z.string().min(1, 'Test case input is required'),
        output: z.string().min(1, 'Test case output is required')
    })).optional()
});

export const findByDifficultySchema = z.object({
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
        required_error: 'Difficulty query parameter is required',
        invalid_type_error: 'Difficulty must be one of Easy, Medium, or Hard'
    })
});

export type CreateProblemDto = z.infer<typeof createProblemSchema>;
export type UpdateProblemDto = z.infer<typeof updateProblemSchema>;