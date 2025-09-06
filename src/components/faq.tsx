'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "What is watchRasta?",
        answer: "watchRasta is a platform for music lovers and culture enthusiasts to discover new music, read artist stories, and get insights into the creative world."
    },
    {
        question: "What is HiLeaves?",
        answer: "HiLeaves is a curated collection of natural products and services, each with a unique origin story. You can shop for food, merch, and wellness services."
    },
    {
        question: "How can I save my favorite articles?",
        answer: "You can create an account and click the bookmark icon on any article to save it to your personal 'My Favorites' collection."
    },
    {
        question: "What is the AI Track Analyzer?",
        answer: "Our AI-powered tool helps you determine if two music tracks are stylistically compatible. Simply upload two audio files and our AI will provide a detailed analysis."
    },
    {
        question: "How can I get in touch for bookings or press inquiries?",
        answer: "Please use the contact form on our 'Contact' page to send us a message. We'll get back to you as soon as possible."
    },
    {
        question: "Do you ship merchandise internationally?",
        answer: "Yes, we ship our artisanal merch worldwide. Shipping costs and times vary depending on the destination. Please refer to our Terms & Conditions for more details."
    }
]

export function Faq() {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                    <AccordionItem value={`item-${i}`} key={i}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-base text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
