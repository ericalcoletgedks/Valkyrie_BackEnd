import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middlewares/validation';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/create-account', 
    body('name').notEmpty().withMessage('Name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('password').isLength({min: 8}).withMessage('Your password is too short, it needs at least 8 characters.'),
    body('password_confirmation').custom((value, {req}) => {
        if (req.body.password !== value) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    body('email').isEmail().toLowerCase().withMessage('Not valid email'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login', 
    body('email').isEmail().withMessage('Not valid email'),
    body('password').notEmpty().withMessage('Not valid password.'),
    handleInputErrors,
    AuthController.login
);

router.post('/request-code', 
    body('email').isEmail().toLowerCase().withMessage('Not valid email'),
    handleInputErrors,
    AuthController.requestConfirmationCode
);

/* Forgot Passworc */

router.post('/forgot-password', 
    body('email').isEmail().toLowerCase().withMessage('Not valid email'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token').notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Invalid token').notEmpty().withMessage('Token is required'),
    body('password').isLength({min: 8}).withMessage('Your password is too short, it needs at least 8 characters.'),
    body('password_confirmation').custom((value, {req}) => {
        if (req.body.password !== value) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/* Auth Routes */
router.put('/profile',
    authenticate,
    body('name').notEmpty().withMessage('Name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().toLowerCase().withMessage('Not valid email'),
    handleInputErrors,
    AuthController.updateProfile,
)

router.put('/update-password',
    authenticate,
    body('current_password').notEmpty().withMessage('Current password is required'),
    body('password').isLength({min: 8}).withMessage('Your password is too short, it needs at least 8 characters.'),
    body('password_confirmation').custom((value, {req}) => {
        if (req.body.password !== value) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
);


export default router;