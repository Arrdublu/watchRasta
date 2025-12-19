
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Briefcase, Heart, Lightbulb, Users } from 'lucide-react';

const values = [
    {
        icon: <Lightbulb className="h-8 w-8 text-primary" />,
        title: 'Innovate Fearlessly',
        description: 'We embrace creativity and push the boundaries of what\'s possible in music and technology.',
    },
    {
        icon: <Heart className="h-8 w-8 text-primary" />,
        title: 'Champion the Artist',
        description: 'Our work is dedicated to empowering creators and sharing their stories with the world.',
    },
    {
        icon: <Users className="h-8 w-8 text-primary" />,
        title: 'Build Community',
        description: 'We believe in the power of connection, fostering a vibrant and inclusive space for fans and artists alike.',
    },
];

export default function CareerPage() {
    return (
      <>
        <div className="container py-16 md:py-24">
            <div className="text-center mb-16">
                <Briefcase className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-4xl md:text-6xl font-headline font-bold">Join the Movement</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    We are a passionate team of storytellers, tech enthusiasts, and music lovers dedicated to building the future of cultural expression. If you're driven by creativity and innovation, you might be a perfect fit.
                </p>
            </div>
            
            <div className="mb-20">
                <h2 className="text-3xl font-headline font-bold text-center mb-10">Our Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {values.map((value, index) => (
                        <div key={index} className="p-6 border rounded-lg bg-card/50">
                            <div className="flex justify-center mb-4">{value.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                            <p className="text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center py-16 px-6 border-2 border-dashed border-border/60 rounded-lg bg-secondary/30">
              <h2 className="text-3xl font-headline font-bold">No Open Positions Right Now</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                We're always on the lookout for exceptional talent. If you believe you have what it takes to contribute to our mission, we'd love to hear from you.
              </p>
              <Button asChild size="lg" className="mt-8">
                  <a href="mailto:careers@watchrasta.com?subject=Spontaneous Application">
                    Send Us Your Resume
                  </a>
              </Button>
            </div>
        </div>
      </>
    );
}
