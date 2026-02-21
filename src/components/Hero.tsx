

import { Suspense, lazy } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { motion, useScroll, useTransform } from 'framer-motion';

const Spline = lazy(() => import('@splinetool/react-spline'));

export const Hero = () => {
    const { scrollY } = useScroll();

    // Parallax animation values based on window scroll position
    const textY = useTransform(scrollY, [0, 600], [0, -150]);
    const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const splineOpacity = useTransform(scrollY, [0, 800], [0.7, 0.2]);

    return (
        <section className="relative w-full h-[90vh] bg-black flex items-center justify-center overflow-hidden font-body">

            {/* The Spline 3D Scene */}
            <motion.div style={{ opacity: splineOpacity }} className="absolute inset-0 z-0">
                <ErrorBoundary fallback={<div className="w-full h-full bg-[#050a07] flex items-center justify-center text-[#00d0ff] font-bold">Interactive 3D Environment Offline</div>}>
                    <Suspense fallback={<div className="w-full h-full bg-[#050a07] flex items-center justify-center text-[#00d0ff] font-bold">Loading 3D Engine...</div>}>
                        <Spline scene="https://prod.spline.design/D2DFfmegP2QXnHkJ/scene.splinecode" />
                    </Suspense>
                </ErrorBoundary>
            </motion.div>

            <motion.div
                style={{ y: textY, opacity: textOpacity }}
                className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto pointer-events-none mt-[-5vh]"
            >
                <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-light tracking-tight leading-[1.05] mb-6 drop-shadow-2xl flex flex-col items-center">
                    <span className="text-[#10b981] drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] block">
                        Redefining
                    </span>
                    <span className="text-[#E2E8F0] block">
                        Modern Agriculture
                    </span>
                </h1>

                <p className="text-[#94A3B8] text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
                    Smart tools bridging the gap between Indian farmers and consumers — so you don't have to worry about fair prices.
                </p>
            </motion.div>

            <motion.div style={{ opacity: textOpacity }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-[11px] text-[#475569] tracking-wider pointer-events-none">
                Press on the canvas to focus and interact
            </motion.div>

            {/* Edge fades to blend properly with other sections */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020604] to-transparent pointer-events-none z-0"></div>
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-0"></div>
        </section>
    );
};
