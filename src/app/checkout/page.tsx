
import { CheckoutForm } from '@/components/checkout-form';

export default function CheckoutPage() {
    return (
        <div className="container py-16 md:py-24">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Checkout</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Complete your purchase below.
                </p>
            </div>
            <div className="mt-16 max-w-lg mx-auto">
                <CheckoutForm />
            </div>
        </div>
    );
}
