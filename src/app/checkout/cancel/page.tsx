
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <div className="container py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Checkout Canceled</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Your checkout session has been canceled.
            </p>
            <Link href="/checkout" className="mt-8 inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium">
                Try Again
            </Link>
        </div>
    );
}
