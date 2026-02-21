"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
    {
        tempId: 0,
        testimonial: "FarmVerse has completely changed how I sell my harvest. We get fair prices 5x faster.",
        by: "Rajesh, Grain Farmer from Punjab",
        imgSrc: "/avatars/avatar_rajesh.png"
    },
    {
        tempId: 1,
        testimonial: "I'm confident my profits are secure with FarmVerse. I couldn't say that about local mandis.",
        by: "Anjali, Organic Producer in Kerala",
        imgSrc: "/avatars/avatar_anjali.png"
    },
    {
        tempId: 2,
        testimonial: "I know it's cliche, but we were losing margins before we found FarmVerse. Can't thank you enough!",
        by: "Gurdeep, Dairy Co-operative Leader",
        imgSrc: "/avatars/avatar_gurdeep.png"
    },
    {
        tempId: 3,
        testimonial: "The direct-to-consumer model makes planning for the future seamless. Can't recommend them enough!",
        by: "Priya, Horticulture Specialist",
        imgSrc: "/avatars/avatar_priya.png"
    },
    {
        tempId: 4,
        testimonial: "If I could give FarmVerse 11 stars, I'd give 12. Fair trade at its best.",
        by: "Amar, Wheat Farmer in UP",
        imgSrc: "/avatars/avatar_amar.png"
    },
    {
        tempId: 5,
        testimonial: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I've saved thousands in commission fees.",
        by: "Sneha, Spices Vendor",
        imgSrc: "/avatars/avatar_sneha.png"
    },
    {
        tempId: 6,
        testimonial: "Took some convincing, but now that we're selling on FarmVerse, we're never going back.",
        by: "Vikas, Vegetable Farmer",
        imgSrc: "/avatars/avatar_vikas.png"
    },
    {
        tempId: 7,
        testimonial: "I would be lost without the Mandi Price API feature. The insights are EASILY 100X for us.",
        by: "Amit, Agri-Tech Consultant",
        imgSrc: "/avatars/avatar_amit.png"
    },
    {
        tempId: 8,
        testimonial: "It's just the best platform for rural producers. Period.",
        by: "Meera, Cashew Harvester",
        imgSrc: "/avatars/avatar_meera.png"
    },
    {
        tempId: 9,
        testimonial: "I switched 5 years ago and never looked back. The supplies catalog is amazing too.",
        by: "Rohan, Tractor Operator",
        imgSrc: "/avatars/avatar_rohan.png"
    }
];

interface TestimonialCardProps {
    position: number;
    testimonial: typeof testimonials[0];
    handleMove: (steps: number) => void;
    cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    position,
    testimonial,
    handleMove,
    cardSize
}) => {
    const isCenter = position === 0;

    return (
        <div
            onClick={() => handleMove(position)}
            className={cn(
                "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out rounded-2xl",
                isCenter
                    ? "z-10 bg-primary text-white border-green-700 shadow-[0_8px_0_4px_#15803d]"
                    : "z-0 bg-white text-green-950 border-green-200 hover:border-primary/50"
            )}
            style={{
                width: cardSize,
                height: cardSize,
                clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
                transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `
            }}
        >
            <span
                className={cn("absolute block origin-top-right rotate-45", isCenter ? "bg-green-700" : "bg-green-200")}
                style={{
                    right: -2,
                    top: 48,
                    width: SQRT_5000,
                    height: 2
                }}
            />
            <img
                src={testimonial.imgSrc}
                alt={`${testimonial.by.split(',')[0]}`}
                className="mb-4 h-14 w-14 rounded-full bg-green-100 object-cover object-center border-2 border-white"
                style={{
                    boxShadow: isCenter ? "3px 3px 0px #15803d" : "3px 3px 0px #bbf7d0"
                }}
            />
            <h3 className={cn(
                "text-base sm:text-lg font-medium font-heading leading-snug",
                isCenter ? "text-white" : "text-green-950"
            )}>
                "{testimonial.testimonial}"
            </h3>
            <p className={cn(
                "absolute bottom-8 left-8 right-8 mt-2 text-sm italic",
                isCenter ? "text-green-100" : "text-gray-500"
            )}>
                - {testimonial.by}
            </p>
        </div>
    );
};

export const StaggerTestimonials: React.FC = () => {
    const [cardSize, setCardSize] = useState(365);
    const [testimonialsList, setTestimonialsList] = useState(testimonials);

    const handleMove = (steps: number) => {
        const newList = [...testimonialsList];
        if (steps > 0) {
            for (let i = steps; i > 0; i--) {
                const item = newList.shift();
                if (!item) return;
                newList.push({ ...item, tempId: Math.random() });
            }
        } else {
            for (let i = steps; i < 0; i++) {
                const item = newList.pop();
                if (!item) return;
                newList.unshift({ ...item, tempId: Math.random() });
            }
        }
        setTestimonialsList(newList);
    };

    useEffect(() => {
        const updateSize = () => {
            const { matches } = window.matchMedia("(min-width: 640px)");
            setCardSize(matches ? 365 : 290);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <section className="py-20 relative bg-[#fbfbfb]">
            <div className="max-w-7xl mx-auto px-4 text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Trusted Across India</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Hear what our farming community has to say about their experience with FarmVerse.</p>
            </div>

            <div
                className="relative w-full overflow-hidden"
                style={{ height: 500 }}
            >
                {testimonialsList.map((testimonial, index) => {
                    const position = testimonialsList.length % 2
                        ? index - (testimonialsList.length + 1) / 2
                        : index - testimonialsList.length / 2;
                    return (
                        <TestimonialCard
                            key={testimonial.tempId}
                            testimonial={testimonial}
                            handleMove={handleMove}
                            position={position}
                            cardSize={cardSize}
                        />
                    );
                })}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4">
                    <button
                        onClick={() => handleMove(-1)}
                        className={cn(
                            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-full",
                            "bg-white border-2 border-green-200 text-green-800 hover:bg-primary hover:text-white hover:border-primary shadow-sm",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        )}
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={() => handleMove(1)}
                        className={cn(
                            "flex h-14 w-14 items-center justify-center text-2xl transition-colors rounded-full",
                            "bg-white border-2 border-green-200 text-green-800 hover:bg-primary hover:text-white hover:border-primary shadow-sm",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        )}
                        aria-label="Next testimonial"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
};
