import mongoose from 'mongoose';
import logger from './logger.config';
import { serverConfig } from '.';

export const connectToDatabase = async () => {
    try {
        const dbUrl = serverConfig.DB_URL || 'mongodb://localhost:27017/LeetCodeDB';
        await mongoose.connect(dbUrl);
        logger.info('Connected to MongoDB successfully');

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed due to application termination');
            process.exit(0);
        });

    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}