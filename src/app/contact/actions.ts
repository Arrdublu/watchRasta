
'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function submitContactForm(data: z.infer<typeof formSchema>) {
    const parsedData = formSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_PASSWORD) {
      console.error('Google Workspace credentials are not configured in .env file.');
      // Fallback for local development without credentials
      console.log('Simulating email sending for contact form submission:', parsedData.data);
      return { success: true, message: 'Your message has been sent successfully! (Simulated)' };
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
            from: `"${parsedData.data.name}" <${process.env.GMAIL_EMAIL}>`,
            to: 'hi@watchrasta.com',
            subject: `New Contact Form Message from ${parsedData.data.name}`,
            text: `Name: ${parsedData.data.name}\nEmail: ${parsedData.data.email}\n\nMessage:\n${parsedData.data.message}`,
            replyTo: parsedData.data.email,
        });

        console.log(`Contact form submission from ${parsedData.data.name} <${parsedData.data.email}>`);
        return { success: true, message: 'Your message has been sent successfully!' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'There was an error sending your message. Please try again later.' };
    }
}
