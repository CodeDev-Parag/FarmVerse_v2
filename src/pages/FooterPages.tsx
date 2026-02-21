import { Link } from 'react-router-dom';

const PageContainer = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex-1 bg-[#fbfbfb] py-16 px-4">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
            <h1 className="text-4xl font-heading font-bold text-primary mb-8">{title}</h1>
            <div className="prose prose-green max-w-none text-gray-600 space-y-4">
                {children}
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100">
                <Link to="/" className="text-primary font-bold hover:underline flex items-center gap-2 w-max">
                    ← Back to Marketplace
                </Link>
            </div>
        </div>
    </div>
);

export const AboutUs = () => (
    <PageContainer title="About Us">
        <p className="text-xl leading-relaxed text-gray-700">
            FarmVerse is India's premier agricultural marketplace, designed to bridge the gap between hardworking farmers and consumers. Our mission is to eliminate middlemen, ensuring fair prices for producers and fresh, affordable produce for buyers.
        </p>
        <p>Founded in 2026, we've helped over 10,000 farmers transition to direct-to-consumer digital sales.</p>
    </PageContainer>
);

export const HowItWorks = () => (
    <PageContainer title="How It Works">
        <h3 className="text-2xl font-bold text-gray-800 mt-6 mb-3">For Farmers</h3>
        <ol className="list-decimal pl-5 space-y-2">
            <li>Register with your mobile number securely via OTP.</li>
            <li>List your fresh produce or browse our subsidized agricultural supplies catalog.</li>
            <li>Receive confirmed orders and dispatch them at fair market prices.</li>
        </ol>
        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-3">For Consumers</h3>
        <ul className="list-disc pl-5 space-y-2">
            <li>Browse fresh, locally-sourced produce.</li>
            <li>Add items to your cart and checkout securely with your verified phone number.</li>
            <li>Get fresh harvest delivered straight from the farm to your doorstep!</li>
        </ul>
    </PageContainer>
);

export const FarmerDirectory = () => (
    <PageContainer title="Farmer Directory">
        <p>Find trusted, verified farmers in your region. We are currently compiling our 2026 registry.</p>
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl mt-6">
            <h4 className="font-bold text-green-900">Directory Access Restricted</h4>
            <p className="text-green-800 text-sm mt-1">Please log in to your consumer account to view verified seller details due to privacy policies.</p>
        </div>
    </PageContainer>
);

export const GovernmentSchemes = () => (
    <PageContainer title="Government Schemes (PM-KISAN)">
        <p>As part of our commitment to agricultural welfare, FarmVerse integrates directly with National Agri-Stack initiatives.</p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
            <li><strong>PM-KISAN SAMMAN NIDHI:</strong> Direct income support of ₹6,000 per year. <a href="#" className="text-primary underline">Verify Status</a></li>
            <li><strong>PM Fasal Bima Yojana:</strong> Crop insurance for unseasonal rainfall.</li>
            <li><strong>Kisan Credit Card (KCC):</strong> Subsidized loans up to ₹3 Lakhs at 4% interest.</li>
        </ul>
    </PageContainer>
);

export const ContactUs = () => (
    <PageContainer title="Contact Support">
        <p>Need help? Our agricultural experts are available 24/7.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 border border-gray-100 rounded-xl bg-gray-50">
                <h4 className="font-bold mb-2">Toll-Free Helpline</h4>
                <p className="text-2xl font-heading text-primary font-bold">1800-120-FARM</p>
                <p className="text-sm mt-2">Available in Hindi, English, and 8 regional languages.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-xl bg-gray-50">
                <h4 className="font-bold mb-2">Email Desk</h4>
                <p className="text-blue-600 font-medium">kisan-support@farmverse.in</p>
            </div>
        </div>
    </PageContainer>
);

export const FAQ = () => (
    <PageContainer title="Frequently Asked Questions">
        <div className="space-y-6">
            <div>
                <h4 className="font-bold text-lg text-gray-800">Is delivery really free?</h4>
                <p className="mt-1">Yes! FarmVerse subsidizes logistics to ensure consumers pay exactly what the farmer earns.</p>
            </div>
            <div>
                <h4 className="font-bold text-lg text-gray-800">How do I track my harvest order?</h4>
                <p className="mt-1">Once logged in, click on your profile in the top right to view real-time GPS tracking of your shipment.</p>
            </div>
            <div>
                <h4 className="font-bold text-lg text-gray-800">Are the agricultural supplies tested?</h4>
                <p className="mt-1">All seeds, fertilizers, and tools in our 'supplies' section are ICAR-approved and sourced directly from brands like BigHaat to guarantee authenticity.</p>
            </div>
        </div>
    </PageContainer>
);

export const TermsOfService = () => (
    <PageContainer title="Terms of Service & Privacy">
        <p>Last updated: Feb 2026</p>
        <h3 className="font-bold mt-6 mb-2">1. Data Privacy</h3>
        <p className="text-sm">We strictly adhere to the Digital Personal Data Protection Act (DPDP), ensuring that farmer acreage statistics and consumer addresses are encrypted and never sold to third-party ad networks.</p>
        <h3 className="font-bold mt-6 mb-2">2. Liability</h3>
        <p className="text-sm">FarmVerse acts as a technology facilitator. While we enforce strict quality control, the liability of produce freshness ultimately falls on the registered seller. We do, however, offer a 24-hour hassle-free refund policy for damaged goods.</p>
    </PageContainer>
);
