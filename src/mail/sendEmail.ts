import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

export const sendEmail = async(email: string, ens: string, amount: string) => {

    try {
        const transporter = nodemailer.createTransport({
            host: "smtppro.zoho.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
    
        const depositEmail = {
            from: `Deposits @ susu.club <${process.env.USER}>`,
            to: email, // Dynamic recipient email address
            subject: 'susu club deposit',
            html: `
                <p>Dear ${ens},</p>

                <p>We’re excited to inform you that your recent deposit of <strong>$${amount}</strong> has been successfully credited to your Susu Box. You're doing an amazing job with your savings!</p>

                <p>There's nothing more you need to do at this time. When it's convenient, feel free to check your updated balance in your account.</p>

                <p>Thank you for your continued trust, and as always, stay safe and keep up the great savings!</p>

                <p>Warm regards,<br/>susu.club</p>
            `,
        };
        await transporter.sendMail(depositEmail);
    } catch (error) {
        console.log(error)
    }

}



