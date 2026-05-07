require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const seedAdminUser = require('./config/adminSeeder');

// Routes
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ================= TEST ROUTE =================
app.get('/', (req, res) => {
  res.send('🚀 Backend is working properly');
});

// ================= ROUTES =================
app.use('/api', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api', statsRoutes);

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI);
    await seedAdminUser();

    console.log('✅ MongoDB Connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ DB Error:', error.message);
    process.exit(1);
  }
};

startServer();
