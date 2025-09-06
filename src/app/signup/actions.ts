'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

const newUserSchema = z.object({
  email: z.string().email(),
});

export async function sendNewUserEmail(data: z.infer<typeof newUserSchema>) {
    const parsedData = newUserSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    const { email } = parsedData.data;

    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_PASSWORD) {
        console.error('Google Workspace credentials are not configured in .env file.');
        console.log(`Simulating new user notification for: ${email}`);
        return { success: true, message: 'New user signup notification sent! (Simulated)' };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_EMAIL,
            to: 'hi@watchrasta.com',
            subject: 'New User Signup',
            text: `A new user has signed up with the email: ${email}`,
        });

        return { success: true, message: 'New user signup notification sent!' };
    } catch (error) {
        console.error('Error sending new user email:', error);
        return { success: false, message: 'There was an error sending the new user notification.' };
    }
}
