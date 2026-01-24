import { Request, Response } from "express";
import User from "../models/User";
import Project from "../models/Project";

export class TeamController {

    static findMemberByEmail = async (req: Request, res: Response) => {

        const { email } = req.body;
        const user = await User.findOne({ email }).select('_id email name lastname');
        if (!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return
        };

        if (user.email === req.user.email) {
            const error = new Error('You are the manager of this project');
            res.status(409).json({ error: error.message });
            return
        };

        res.json(user);
    };

    static getProjectTeam = async (req: Request, res: Response) => {

        const project = await Project.findById(req.project.id).populate({ 
            path: 'team',
            select: 'id email name lastname' 
        });

        res.json(project.team);

    };

    static addMemberById = async (req: Request, res: Response) => {

        const { id } = req.body;
        const user = await User.findById(id).select('_id');
        if (!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return
        };

        if (user.email === req.user.email) {
            const error = new Error('You are the manager of this project');
            res.status(409).json({ error: error.message });
            return
        };

        if (req.project.team.some(member => member.toString() === user.id.toString())) {
            const error = new Error('The user is already a member of this project');
            res.status(409).json({ error: error.message });
            return
        };

        req.project.team.push(user.id);

        await req.project.save();

        res.json(`User added to: ${req.project.projectName}`)
    };

    static removeMemberById = async (req: Request, res: Response) => {

        const { userId } = req.params;

        if (!req.project.team.some(member => member.toString() === userId.toString())) {
            const error = new Error('The user is not a member of this project');
            res.status(409).json({ error: error.message });
            return
        };

        req.project.team = req.project.team.filter(member => member.toString() !== userId.toString());
        await req.project.save();

        res.json(`User removed from: ${req.project.projectName}`)

        
    };

}