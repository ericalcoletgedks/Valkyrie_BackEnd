import type { Request, Response } from "express"
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {

            const { password, email } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                const error = new Error('This user account already exists.');
                res.status(409).json({ error: error.message });
                return
            }

            const user = new User(req.body);
            user.password = await hashPassword(password);

            // Generar Token
            const token = new Token({
                token: generateToken(),
                user: user.id
            });

            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.json('Account created, please check your email to confirm.');

        } catch (error) {
            res.status(500).json('There was an error');
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {

            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Invalid or expired token');
                res.status(404).json({ error: error.message });
                return
            }

            const user = await User.findById(tokenExists.user);
            user.confirmed = true;

            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

            res.send('Account confirmed successfully');

        } catch (error) {
            res.status(500).json('There was an error');
        }
    }

    static login = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body;
            const user = await User.findOne({ email });

            // Validación de usuario
            if (!user) {
                const error = new Error('User not found');
                res.status(404).json({ error: error.message });
                return
            }

            // Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('Incorrect credentials.');
                res.status(401).json({ error: error.message });
                return
            };

            // Usuario confirmado
            if (!user.confirmed) {

                // Crear token para usuario no confirmado
                const token = new Token();
                token.user = user.id;
                token.token = generateToken();
                await token.save();

                // Enviar el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('This account has not been confirmed yet, please check your email.');
                res.status(401).json({ error: error.message });
                return
            };

            const token = generateJWT({ id: user.id });
            res.send(token);

        } catch (error) {
            res.status(500).json('There was an error');
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {

            const { email } = req.body;

            // Usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('This user account does not exists.');
                res.status(404).json({ error: error.message });
                return
            }

            // Usuario ya esta confirmado
            if (user.confirmed) {
                const error = new Error('This user account is already confirmed.');
                res.status(403).json({ error: error.message });
                return
            }

            // Generar Token
            const token = new Token({
                token: generateToken(),
                user: user.id
            });

            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.json('New token sent, please check your email to confirm.');

        } catch (error) {
            res.status(500).json('There was an error');
        }
    }

    /* New Password */

    static forgotPassword = async (req: Request, res: Response) => {
        try {

            const { email } = req.body;

            // Usuario existe
            const user = await User.findOne({ email });
            if (!user) {
                const error = new Error('This user account does not exists.');
                res.status(404).json({ error: error.message });
                return
            }

            // Si existe se envia un token
            // Generar Token
            const token = new Token({
                token: generateToken(),
                user: user.id
            });

            // Enviar el email
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save();
            res.json("We've sent you an email with instructions to reset your password.");


        } catch (error) {
            res.status(500).json('There was an error');
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {

            const { token } = req.body;

            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Invalid or expired token');
                res.status(404).json({ error: error.message });
                return
            }

            res.send('Valid token, choose your new password.');

        } catch (error) {
            res.status(500).json('There was an error');
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {

            const { token } = req.params;
            const { password } = req.body;

            const tokenExists = await Token.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Invalid or expired token');
                res.status(404).json({ error: error.message });
                return
            }

            const user = await User.findById(tokenExists.user._id);
            user.password = await hashPassword(password);

            // Guardar la contraseña y eliminar el token
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send('You have successfully changed your password.');

        } catch (error) {
            res.status(500).json('There was an error');
        }
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user);
        return
    }

    static updateProfile = async (req: Request, res: Response) => {

        const { name, lastname, email } = req.body;

        const userExists = User.findOne({ email });
        if (userExists && req.user.email !== email) {
            const error = new Error('Email already in use');
            res.status(409).json({ error: error.message });
            return
        }

        req.user.name = name;
        req.user.lastname = lastname;
        req.user.email = email;

        try {

            await req.user.save();
            res.send('Profile updated successfully');

        } catch (error) {
            res.status(500).json('There was an error');
        }

    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {

        const { current_password, password } = req.body;

        const user = await User.findById(req.user.id);

        const isPasswordCorrect = await checkPassword(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Wrong password');
            res.status(401).json({ error: error.message });
            return
        }

        try {

            user.password = await hashPassword(password);
            await user.save();
            res.send('Password changed successfully');

        } catch (error) {
            res.status(500).json('There was an error');
        }

    }

}
