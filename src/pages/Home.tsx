import { Hero } from '../components/Hero';
import { Marketplace } from '../components/Marketplace';
import { StaggerTestimonials } from '../components/Testimonials';

export const Home = () => {
    return (
        <div className="flex-1 relative bg-white">
            <div className="sticky top-0 z-0 w-full">
                <Hero />
            </div>

            {/* The page sections that overlap the Hero section smoothly on scroll */}
            <div className="relative z-10 bg-[#fbfbfb] shadow-[0_-15px_40px_rgba(0,0,0,0.15)] rounded-t-[3rem] mt-[-5vh]">
                <Marketplace />
                <StaggerTestimonials />
            </div>
        </div>
    );
};
