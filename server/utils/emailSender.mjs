import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    host: "smtp.ionos.com",
    port: 587,
    secure: false,
    auth: {
        user: emailUser,
        pass: emailPassword
    }
});

const sendEmail = async (to, subject, text, html, from) => {
    try {
        const result = await transporter.sendMail({
            from: from || '"Bogey Pad" <noreply@bogeypad.com>',
            to: to,
            subject: subject,
            text: text,
            html: html
        });
        if(result?.accepted?.[0] === to) {
            return { success: true };
        }
        else throw new Error (`recipient ${to} was rejected`);
    } catch (error) {
        console.log(`Could not send email: ${error}.`);
        return { success: false };
    }
}

export { sendEmail };