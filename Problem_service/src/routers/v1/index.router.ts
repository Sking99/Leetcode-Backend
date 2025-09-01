import express from 'express';
import pingRouter from './ping.router';
import problemRouter from './problem.router';

const v1Router = express.Router();



v1Router.use('/ping',  pingRouter);
v1Router.use('/problem', problemRouter);

export default v1Router;