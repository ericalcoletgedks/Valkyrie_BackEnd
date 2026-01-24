import { Router } from "express";
import { body, param } from 'express-validator';
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middlewares/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middlewares/project";
import { hasAuthorization, taskExists } from "../middlewares/task";
import { authenticate } from "../middlewares/auth";
import { TeamController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

router.use(authenticate);

router.post('/',
    body('projectName').notEmpty().withMessage('project name is required'),
    body('clientName').notEmpty().withMessage('client name is required'),
    body('description').notEmpty().withMessage('desription is required'),
    handleInputErrors,
    ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get('/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    body('projectName').notEmpty().withMessage('project name is required'),
    body('clientName').notEmpty().withMessage('client name is required'),
    body('description').notEmpty().withMessage('desription is required'),
    handleInputErrors,
    ProjectController.updateProject
);

router.delete('/:id',
    param('id').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    ProjectController.deleteProject
);

/* Routes for Tasks */
router.param('projectId', projectExists);
router.param('taskId', taskExists);

router.post('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    body('name').notEmpty().withMessage('task name is required'),
    body('description').notEmpty().withMessage('task description is required'),
    handleInputErrors,
    TaskController.createTask
);

router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.getProjectTasks
);

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    body('name').notEmpty().withMessage('task name is required'),
    body('description').notEmpty().withMessage('task description is required'),
    handleInputErrors,
    TaskController.updateTask
);

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid ID'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TaskController.deleteTask
);

router.patch('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid ID'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    body('status').notEmpty().withMessage('Status is required'),
    handleInputErrors,
    TaskController.updateStatus
);

/* Routes for teams */

router.post('/:projectId/team/find', 
    body('email').isEmail().toLowerCase().withMessage('Not valid email'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamController.findMemberByEmail
);

router.get('/:projectId/team',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamController.getProjectTeam
);

router.post('/:projectId/team', 
    body('id').isMongoId().withMessage('Invalid user ID'),
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    TeamController.addMemberById
);

router.delete('/:projectId/team/:userId', 
    param('userId').isMongoId().withMessage('Invalid user ID'),
    param('projectId').isMongoId().withMessage('Invalid project ID'),
    handleInputErrors,
    TeamController.removeMemberById
);

/* Routes for Notes */

router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('A note cannot be empty'),
    handleInputErrors,
    NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes',
    handleInputErrors,
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Not valid id'),
    handleInputErrors,
    NoteController.deleteNote
)



export default router;