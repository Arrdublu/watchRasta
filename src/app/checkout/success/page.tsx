
import Link from "next/link";

export default function CheckoutSuccessPage() {
    return (
        <div className="container py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Checkout Successful</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Thank you for your purchase!
            </p>
            <Link href="/" className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium">
                Return to Homepage
            </Link>
        </div>
    );
}
