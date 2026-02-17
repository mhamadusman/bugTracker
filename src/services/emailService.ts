import nodemailer from "nodemailer";
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
        to: to,
        subject: subject,
        html: html,
      });
      console.log("Email sent:", info.messageId);
      return info;
    } catch (error) {
      console.error("Email Service Error:", error);
      return null
    }
  }

  static async notifyNewProjectCreation(
    receivers: string[],
    managerName: string,
    projectName: string,
    description: string
  ) {
    const htmlBody = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>New Project Assigned</h2>
        <p><strong>Manager:</strong> ${managerName}</p>
        <p><strong>Project Name:</strong> ${projectName}</p>
        <hr />
        <p><strong>Description:</strong></p>
        <p>${description}</p>
      </div>
    `;
    if(receivers.length === 0){
      return 
    }
    await this.sendEmail(receivers, `Project Created: ${projectName}`, htmlBody);
  }

}