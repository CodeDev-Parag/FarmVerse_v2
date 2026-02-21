import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-[#0F1A0F] text-green-50 pt-16 pb-8 border-t-8 border-primary mt-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="text-3xl">🌾</span>
                            <span className="font-heading font-bold text-3xl text-white">FarmVerse</span>
                        </Link>
                    </div>
                    <p className="text-green-200/80 mb-6 max-w-sm">
                        Bridging the gap between Indian farmers and consumers. Fresh produce, fair prices, direct impact.
                    </p>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-4 text-secondary">Quick Links</h4>
                    <ul className="space-y-3 text-green-200/80">
                        <li><Link to="/about" className="hover:text-white transition block">About Us</Link></li>
                        <li><Link to="/how-it-works" className="hover:text-white transition block">How it Works</Link></li>
                        <li><Link to="/directory" className="hover:text-white transition block">Farmer Directory</Link></li>
                        <li><Link to="/schemes" className="hover:text-white transition block">Government Schemes</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-4 text-secondary">Support</h4>
                    <ul className="space-y-3 text-green-200/80">
                        <li><Link to="/contact" className="hover:text-white transition block">Contact Us</Link></li>
                        <li><Link to="/faq" className="hover:text-white transition block">FAQ</Link></li>
                        <li><Link to="/api" className="hover:text-white transition block">Mandi Price API</Link></li>
                        <li><Link to="/terms" className="hover:text-white transition block">Terms of Service</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-heading font-bold text-lg mb-4 text-secondary">Newsletter</h4>
                    <p className="text-sm text-green-200/80 mb-4">Get the latest fresh harvest alerts.</p>
                    <div className="flex">
                        <input type="email" placeholder="Your email address" className="bg-green-950/50 border border-green-800 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-secondary" />
                        <button className="bg-secondary text-white px-4 py-2 rounded-r-lg font-bold hover:bg-amber-600 transition">Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-green-900 border-t border-green-900/40 pt-8">
                © {new Date().getFullYear()} FarmVerse India. All rights reserved.
            </div>
        </footer>
    );
};
