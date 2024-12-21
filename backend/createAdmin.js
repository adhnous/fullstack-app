const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/horsesclub', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'trainer', 'trainee'], default: 'trainee' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('new_admin_password', 10); // Replace with your desired password
  const admin = new User({
    email: 'newadmin@example.com',
    username: 'newadmin',
    password: hashedPassword,
    role: 'admin',
  });

  await admin.save();
  console.log('New admin created:', admin);
  mongoose.disconnect();
}

createAdmin();
