import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

// Models
import User from '../models/userModel.js';
import Student from '../models/studentModel.js';

dotenv.config();

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err));

// Generate 10 users using Faker
const users = Array.from({ length: 10 }, () => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
}));

// Generate 10 students using Faker
const students = Array.from({ length: 10 }, () => ({
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 25 }),
  grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
}));

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear collections
    await User.deleteMany({});
    await Student.deleteMany({});

    console.log('Collections cleared.');

    // Insert data
    await User.insertMany(users);
    console.log('10 users added.');

    await Student.insertMany(students);
    console.log('10 students added.');

  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Execute the seed function
seedDatabase();
