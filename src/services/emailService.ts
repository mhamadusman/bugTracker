import nodemailer from "nodemailer";
import { emailNotificationSchema } from "../schemas/emailNotifySchema";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_APP_PASSWORD,
  },
});

export class emailService {
  static async sendEmail(to: string | string[], subject: string, html: string) {
    try {
      const info = await transporter.sendMail({
        from: `"Project System" <${process.env.SENDER_EMAIL}>`,
        bcc: to,
        subject: subject,
        html: html,
      });
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Email Service Error:", error);
      return null;
    }
  }

  static async notifyNewProjectCreation(
    receivers: string[],
    managerName: string,
    projectName: string,
    description: string,
  ) {
    try {
      const validated = emailNotificationSchema.parse({
        receivers,
        managerName,
        projectName,
        description,
      });
      const htmlBody = `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>New Project Assigned</h2>
          <p><strong>Manager:</strong> ${validated.managerName}</p>
          <p><strong>Project Name:</strong> ${validated.projectName}</p>
          <hr />
          <p><strong>Description:</strong></p>
          <p>${validated.description}</p>
        </div>
      `;

      if (validated.receivers.length === 0) return;

      await this.sendEmail(
        validated.receivers,
        `Project Created: ${validated.projectName}`,
        htmlBody,
      );
    } catch (error) {
      console.error("Email failed in background:", error);
    }
  }
}
