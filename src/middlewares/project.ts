import { Request, Response, NextFunction } from 'express';
import Project, { IProject } from '../models/Project';

declare global {
    namespace Express {
        interface Request { // <-- ¿Por que interface? Interface no reemplaza como type
            project: IProject
        }
    }
}

export const projectExists = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            res.status(404).json({ "error": "Project Not Found" });
            return;
        }
        req.project = project // <-- Guardamos el proyecto en nuestro request
        next();
    } catch (error) {
        res.status(500).json({ error: 'There was an error' });
    }
}