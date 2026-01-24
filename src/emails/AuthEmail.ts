import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {

    static sendConfirmationEmail = async (user: IEmail) => {
        await transporter.sendMail({
            from: 'Valkyrie <no-reply@valkyrie.com>',
            to: user.email,
            subject: 'Valkyrie - Confirm your account',
            text: 'Valkyrie - Confirm your account',
            html: `
            <div style="font-family: Arial, sans-serif; margin:0; padding:0;">

                <!-- Header -->
                <div style="background-color:#000000; padding:50px 20px; color:#ffffff; text-align:center;">
                    <h1 style="margin:0; font-size:28px;">Welcome to Valkyrie</h1>
                </div>

                <!-- Main content -->
                <div style="background-color:#EDEDED; padding:40px 20px; text-align:center;">
                    <h2 style="color:#000000;">Confirm Your Account</h2>
                    <p style="font-size:16px; color:#333333;">
                        Hello ${user.name || ''},<br><br>
                        To complete your registration, please copy the confirmation token below and paste it into the app:
                    </p>

                    <!-- Token Box -->
                    <div style="display:inline-block; background-color:#ffffff; padding:15px 25px; margin-top:20px; border:1px solid #ccc; border-radius:6px; font-size:18px; font-weight:bold; letter-spacing:1px; color:#000000;">
                        ${user.token}
                    </div>

                    <p style="margin-top:30px; font-size:14px; color:#555555;">
                        This token expires in 10 minutes.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color:#000000; padding:20px; text-align:center; color:#ffffff; font-size:12px;">
                    © ${new Date().getFullYear()} Valkyrie. All rights reserved.
                </div>
            </div>
        `
        });


    }

    static sendPasswordResetToken = async (user: IEmail) => {
        await transporter.sendMail({
            from: 'Valkyrie <no-reply@valkyrie.com>',
            to: user.email,
            subject: 'Valkyrie - Reset your password',
            text: 'Valkyrie - Reset your password',
            html: `
            <div style="font-family: Arial, sans-serif; margin:0; padding:0;">

                <!-- Header -->
                <div style="background-color:#000000; padding:50px 20px; color:#ffffff; text-align:center;">
                    <h1 style="margin:0; font-size:28px;">Reset your password</h1>
                </div>

                <!-- Main content -->
                <div style="background-color:#EDEDED; padding:40px 20px; text-align:center;">
                    <h2 style="color:#000000;">Password Reset Request</h2>
                    <p style="font-size:16px; color:#333333;">
                        Hello ${user.name || ''},<br><br>
                        We received a request to reset your password. Copy the token below to continue.
                    </p>

                    <!-- Token Box -->
                    <div style="display:inline-block; background-color:#ffffff; padding:15px 25px; margin-top:20px; border:1px solid #ccc; border-radius:6px; font-size:18px; font-weight:bold; letter-spacing:1px; color:#000000;">
                        ${user.token}
                    </div>

                    <!-- Reset Link -->
                    <p style="margin-top:30px; font-size:16px;">
                        Then paste the token on this url and choose a new password.<br><br>
                        <a href="${process.env.FRONTEND_URL}/auth/new-password#content" style="color:#007BFF; text-decoration:none; font-weight:bold;">Reset Password</a>
                    </p>

                    <p style="margin-top:30px; font-size:14px; color:#555555;">
                        This token will expire in 10 minutes.
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color:#000000; padding:20px; text-align:center; color:#ffffff; font-size:12px;">
                    © ${new Date().getFullYear()} Valkyrie. All rights reserved.
                </div>
            </div>
            `
        });


    }

}