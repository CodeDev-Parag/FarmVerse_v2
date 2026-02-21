const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    farmer: { type: String, required: true },
    image: { type: String },
    category: { type: String, enum: ['produce', 'supply'], default: 'produce' },
    stock: { type: String, default: 'In Stock' },
    subCategory: { type: String }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI not found in environment variables. Please set it in backend/.env");
            process.exit(1);
        }
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Reading bighaat_products.json...");
        const data = fs.readFileSync('bighaat_products.json', 'utf-8');
        const products = JSON.parse(data);

        console.log(`Found ${products.length} products. Clearing 'supply' category products first to avoid duplicates...`);
        await Product.deleteMany({ category: 'supply' });

        console.log("Inserting products...");
        await Product.insertMany(products);

        console.log("Successfully seeded database with BigHaat products!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
