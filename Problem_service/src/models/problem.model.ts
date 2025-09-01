import mongoose, { Document } from "mongoose";

export interface ITestCase {
    input: string;
    output: string;
}

export interface IProblem extends Document{
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testCases: ITestCase[];
}

const testCaseSchema = new mongoose.Schema<ITestCase>({
    input: { 
        type: String, 
        required: [ true, 'Input is required' ],
        trim: true  
    },
    output: { 
        type: String, 
        required: [ true, 'Output is required' ],
        trim: true  
    }
}, 
{ 
    // _id: false // Disable _id for subdocuments if not needed
});

const problemSchema = new mongoose.Schema<IProblem>({
    title: { 
        type: String, 
        required: [ true, 'Title is required' ],
        trim: true,
        minlength: [ 5, 'Title must be at least 5 characters long' ],
        maxlength: [ 100, 'Title cannot exceed 100 characters' ]
    },
    description: { 
        type: String, 
        required: [ true, 'Description is required' ],
        trim: true,
        minlength: [ 20, 'Description must be at least 20 characters long' ]
    },
    difficulty: { 
        type: String, 
        required: [ true, 'Difficulty is required' ],
        enum: {
            values: [ 'Easy', 'Medium', 'Hard' ],
            message: 'Difficulty must be either Easy, Medium, or Hard'
        },
        default: 'Easy'
    },
    editorial: { 
        type: String, 
        trim: true,
    },
    testCases: [ testCaseSchema ],
}, 
{ 
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    toJSON: {
        transform: (_, record) => {
            delete (record as any).__v; // Remove __v field
            record.id = record._id;
            delete record._id;
            return record;
        }
    }
});

problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ difficulty: 1 });

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);