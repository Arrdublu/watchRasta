
'use server';

import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(formData: FormData) {
    const email = formData.get('email') as string;

    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Dummy Product',
                        description: 'This is a dummy product for demonstration purposes.',
                    },
                    unit_amount: 1000, // $10.00
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/checkout/success`,
        cancel_url: `http://localhost:3000/checkout/cancel`,
        customer_email: email,
    });

    if (checkoutSession.url) {
        return { url: checkoutSession.url };
    } else {
        return { url: null };
    }
}
