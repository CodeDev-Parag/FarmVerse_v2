import { useLocation, Link } from 'react-router-dom';

export const Placeholder = () => {
    const location = useLocation();

    // Convert pathname like "/how-it-works" to "How It Works"
    const pageTitle = location.pathname
        .substring(1)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || 'Page Not Found';

    return (
        <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center bg-green-50 px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">{pageTitle}</h1>
            <p className="text-gray-600 text-lg max-w-2xl mb-8">
                This page is currently under development as part of the FarmVerse beta. Stay tuned for updates!
            </p>
            <Link to="/" className="bg-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition shadow-lg">
                Back to Home
            </Link>
        </div>
    );
};
