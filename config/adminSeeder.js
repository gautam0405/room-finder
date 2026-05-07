const User = require('../models/User');

const seedAdminUser = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const admin = new User({
      name: 'System Admin',
      email: adminEmail,
      password: 'admin123', 
      phone: '0000000000',
      role: 'admin',
      isVerified: true,
    });

    await admin.save();
    console.log('Admin user seeded successfully ✅');
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
  }
};

module.exports = seedAdminUser;