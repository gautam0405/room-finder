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

// ================= VALIDATE ENVIRONMENT VARIABLES =================
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ================= TEST ROUTE =================
app.get('/', (req, res) => {
  res.send('🚀 Backend is working properly');
});

// ================= HEALTH CHECK ROUTE =================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ================= ROUTES =================
app.use('/api', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api', statsRoutes);

// ================= ERROR HANDLING =================
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGO_URI.substring(0, 30) + '...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected');
    
    await seedAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Server Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

startServer();
