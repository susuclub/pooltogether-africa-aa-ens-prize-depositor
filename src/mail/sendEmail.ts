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
    
        const rewardEmail = {
            from: `Deposit @ susu.club <${process.env.USER}>`,
            to: email, // Dynamic recipient email address
            subject: 'susu club deposit',
            html: `
              <p>Dear ${ens},</p>
              <p>Your deposit ${amount} has been credited to your account. You have grat saving habits!!</p>
              <p>You dont have to do anything, kindly check your balance when you have a second. stay safe!</p>
            `,
        };
        await transporter.sendMail(rewardEmail);
    } catch (error) {
        console.log(error)
    }

}



