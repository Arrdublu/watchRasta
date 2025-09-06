'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(data: z.infer<typeof formSchema>) {
    const parsedData = formSchema.safeParse(data);

    if (!parsedData.success) {
        return { success: false, message: 'Invalid data provided.' };
    }

    if (!process.env.RESEND_API_KEY) {
      console.log('Resend API key is not configured. Simulating email sending.');
      console.log('New contact form submission:', parsedData.data);
      return { success: true, message: 'Your message has been sent successfully! (Simulated)' };
    }

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev', // This must be a verified domain on Resend
            to: 'hi@watchrasta.com',
            subject: `New message from ${parsedData.data.name}`,
            text: `Name: ${parsedData.data.name}\nEmail: ${parsedData.data.email}\n\nMessage:\n${parsedData.data.message}`,
            reply_to: parsedData.data.email,
        });
        return { success: true, message: 'Your message has been sent successfully!' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'There was an error sending your message. Please try again later.' };
    }
}
