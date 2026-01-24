import { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/Task';

declare global {
    namespace Express {
        interface Request { // <-- ¿Por que interface? Interface no reemplaza como type
            task: ITask
        }
    }
}

export const taskExists = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId }).populate('project');
        if (!task) {
            res.status(404).json({ "error": "Task Not Found" });
            return;
        }
        req.task = task;
        next();

    } catch (error) {
        res.status(500).json({ error: 'There was an error' });
    }
}

export const hasAuthorization = async (req: Request, res: Response, next: NextFunction) => {

    if (req.user.id.toString() !== req.project.manager.toString()) {
        const error = new Error('Not valid action');
        res.status(400).json({ error: error.message });
        return;
    }

    next();
}