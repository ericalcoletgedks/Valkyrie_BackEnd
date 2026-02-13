import { resend } from "../config/resend";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {

  static sendConfirmationEmail = async (user: IEmail) => {
    await resend.emails.send({
      from: "Valkyrie <onboarding@resend.dev>",
      to: user.email,
      subject: "Valkyrie - Confirm your account",
      html: `
        <div style="font-family: Arial, sans-serif; margin:0; padding:0;">
          <div style="background-color:#000000; padding:50px 20px; color:#ffffff; text-align:center;">
            <h1>Welcome to Valkyrie</h1>
          </div>
          <div style="background-color:#EDEDED; padding:40px 20px; text-align:center;">
            <h2>Confirm Your Account</h2>
            <p>Hello ${user.name || ''},<br><br>
            Your confirmation token:</p>
            <div style="display:inline-block; background-color:#fff; padding:15px 25px; border:1px solid #ccc; border-radius:6px; font-size:18px; font-weight:bold;">
              ${user.token}
            </div>
            <p>This token expires in 10 minutes.</p>
          </div>
          <div style="background-color:#000000; padding:20px; text-align:center; color:#ffffff; font-size:12px;">
            © ${new Date().getFullYear()} Valkyrie. All rights reserved.
          </div>
        </div>
      `
    });
  }

  static sendPasswordResetToken = async (user: IEmail) => {
    await resend.emails.send({
      from: "Valkyrie <onboarding@resend.dev>",
      to: user.email,
      subject: "Valkyrie - Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; margin:0; padding:0;">
          <div style="background-color:#000000; padding:50px 20px; color:#ffffff; text-align:center;">
            <h1>Reset your password</h1>
          </div>
          <div style="background-color:#EDEDED; padding:40px 20px; text-align:center;">
            <h2>Password Reset Request</h2>
            <p>Hello ${user.name || ''},<br><br>
            Copy the token below to reset your password:</p>
            <div style="display:inline-block; background-color:#fff; padding:15px 25px; border:1px solid #ccc; border-radius:6px; font-size:18px; font-weight:bold;">
              ${user.token}
            </div>
            <p>Or click here:</p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password#content" style="color:#007BFF; font-weight:bold;">Reset Password</a>
            <p>This token expires in 10 minutes.</p>
          </div>
          <div style="background-color:#000000; padding:20px; text-align:center; color:#ffffff; font-size:12px;">
            © ${new Date().getFullYear()} Valkyrie. All rights reserved.
          </div>
        </div>
      `
    });
  }

}