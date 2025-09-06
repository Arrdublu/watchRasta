'use server';

import { z } from 'zod';

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

    // In a real app, you would integrate a service like Resend or Nodemailer here
    // to send the email to hi@watchrasta.com.
    console.log('New contact form submission:', parsedData.data);
    
    // Simulate sending an email
    return { success: true, message: 'Your message has been sent successfully!' };
}
