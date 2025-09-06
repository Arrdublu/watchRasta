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
        answer: "watchRasta is a platform for watch enthusiasts to discover new collections, read about the lifestyle of watch collectors, and get insights into the world of horology."
    },
    {
        question: "How can I contribute?",
        answer: "We are always looking for passionate writers to contribute to our platform. Please reach out to us at hi@watchrasta.com with your ideas."
    },
    {
        question: "How do I curate my own collection?",
        answer: "You can create an account and start saving your favorite articles and watches to your personal collection."
    },
    {
        question: "What is the AI Style Guide Adaptation?",
        answer: "Our AI-powered tool helps you determine if different watch styles complement each other. Simply upload images of your watches and our AI will provide feedback."
    }\n]

export function Faq() {
    return (
        <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 font-headline">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                    <AccordionItem value={`item-${i}`} key={i}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
