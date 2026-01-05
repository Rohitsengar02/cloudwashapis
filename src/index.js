const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
// Middleware
// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import routes
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const cityRoutes = require('./routes/cityRoutes');
const addonRoutes = require('./routes/addonRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const heroSectionRoutes = require('./routes/heroSectionRoutes');
const webContentRoutes = require('./routes/webContentRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const whyChooseUsRoutes = require('./routes/whyChooseUsRoutes');

// Use routes
app.use('/api/categories', categoryRoutes);
app.use('/api/sub-categories', subCategoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/addons', addonRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hero', heroSectionRoutes);
app.use('/api/web-content', webContentRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/why-choose-us', whyChooseUsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
