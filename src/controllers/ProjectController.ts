import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {

    static createProject = async (req : Request, res : Response) => {
        
        const project = new Project(req.body);

        // Asignar un manager
        project.manager = req.user.id;

        try {

            await project.save();
            res.send('Proyecto creado correctamente');

        } catch (error) {
            console.log(error);
        }

    };

    static getAllProjects = async (req : Request, res : Response) => {
        try {

            const projects = await Project.find({
                $or: [
                    {manager: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            });
            res.json(projects); 

        } catch (error) {
            console.log(error);
        }
    };

    static getProjectById = async (req : Request, res : Response) => {
        try {

            const project = await Project.findById(req.params.id).populate('tasks');

            if (!project) {
                res.status(404).json({ "error": "Id not Found" });
                return;
            }

            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                res.status(404).json({ "error": "Not valid action" });
                return;
            }

            res.json(project); 

        } catch (error) {
            console.log(error);
        }
    };

    static updateProject = async (req : Request, res : Response) => {
        try {

            const project = await Project.findByIdAndUpdate(req.params.id, req.body);

            if (!project) {
                res.status(404).json({ "error": "ID Not Found" });
                return;
            }

            if (project.manager.toString() !== req.user.id.toString()) {
                res.status(404).json({ "error": "Not valid action" });
                return;
            }

            await project.save();

            res.json("Project updated"); 

        } catch (error) {
            console.log(error);
        }
    };

    static deleteProject = async (req : Request, res : Response) => {
        try {

            const project = await Project.findById(req.params.id);

            if (!project) {
                res.status(404).json({ "error": "ID Not Found" });
                return;
            }

            if (project.manager.toString() !== req.user.id.toString()) {
                res.status(404).json({ "error": "Not valid action" });
                return;
            }

            await project.deleteOne();
            res.json("Project deleted"); 

        } catch (error) {
            console.log(error);
        }
    };

};