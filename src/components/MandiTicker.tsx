const MANDI_DATA = [
    { crop: 'Wheat (गेहूं)', price: '₹2,125/q', trend: 'up' },
    { crop: 'Rice (चावल)', price: '₹3,400/q', trend: 'steady' },
    { crop: 'Tomatoes (टमाटर)', price: '₹4,000/q', trend: 'down' },
    { crop: 'Onions (प्याज)', price: '₹1,800/q', trend: 'up' },
    { crop: 'Potatoes (आलू)', price: '₹1,200/q', trend: 'down' },
    { crop: 'Sugarcane (गन्ना)', price: '₹315/q', trend: 'steady' },
];

export const MandiTicker = () => {
    return (
        <div className="bg-green-900 text-white py-3 overflow-hidden whitespace-nowrap border-b-4 border-secondary">
            <div className="inline-block animate-[marquee_20s_linear_infinite]">
                <span className="font-bold text-secondary mr-4 ml-4">LIVE MANDI RATES:</span>
                {MANDI_DATA.map((item, idx) => (
                    <span key={idx} className="mr-8 inline-flex items-center gap-1 font-medium">
                        {item.crop} - {item.price}
                        {item.trend === 'up' && <span className="text-secondary text-lg">↑</span>}
                        {item.trend === 'down' && <span className="text-red-400 text-lg">↓</span>}
                        {item.trend === 'steady' && <span className="text-gray-400 text-lg">-</span>}
                    </span>
                ))}
            </div>
        </div>
    );
};
