import type { Request, Response } from 'express';
import Note, { INote } from '../models/Note';

export class NoteController {

    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {

        const { content } = req.body;
        const note = new Note({
            content,
            createdBy: req.user.id,
            task: req.task.id
        });

        req.task.notes.push(note.id);

        try {

            await Promise.allSettled([req.task.save(), note.save()]);
            res.send('Note created successfully')

        } catch (error) {
            res.status(500).json({ error: 'Something went wrong' });
        };
    };

    static getTaskNotes = async (req: Request<{}, {}, INote>, res: Response) => {
        try {

            const notes = await Note.find({ task: req.task.id }).populate({ path: 'createdBy', select: 'name lastname email' });
            res.json(notes);

        } catch (error) {
            res.status(500).json({ error: 'Something went wrong' });
        };
    };

    static deleteNote = async (req: Request, res: Response) => {
        const { noteId } = req.params;
        const note = await Note.findById(noteId);

        if (!note) {
            const error = new Error('Note not found');
            res.status(404).json({ error: error.message });
            return
        }

        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Not valid action');
            res.status(401).json({ error: error.message });
            return
        };

        try {

            req.task.notes = req.task.notes.filter((note) => note.toString() !== noteId.toString());
            
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Note deleted')

        } catch (error) {
            res.status(500).json({ error: 'Something went wrong' });
        };
    };

}