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

    console.log('New contact form submission:', parsedData.data);
    // In a real app, you would send an email here using a service like Resend or Nodemailer.
    
    return { success: true, message: 'Your message has been sent successfully!' };
}
