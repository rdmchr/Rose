import nodemailer from 'nodemailer';

const mailAccount = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    port: 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export async function sendVerifyEmail(emailAddress: string, link: string) {
    const mail = await mailAccount.sendMail({
        from: process.env.SMTP_FROM,
        to: emailAddress,
        subject: 'Verify your email address',
        text: `Please verify your email address by clicking the following link: ${link}`,
        html: `<p>Please verify your email address by clicking the following link: <a href="${link}">${link}</a></p>`
    });
}

