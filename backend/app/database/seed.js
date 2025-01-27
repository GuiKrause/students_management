import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

import User from '../models/userModel.js';
import Student from '../models/studentModel.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection error:', err));

const fixedEmail = 'test@example.com';
const fixedPassword = 'SecurePassword123';
const saltRounds = 10;

const generateUsers = async () => {
  const hashedPassword = await bcrypt.hash(fixedPassword, saltRounds);
  
  return [
    { email: fixedEmail, password: hashedPassword },
    ...Array.from({ length: 9 }, () => ({
      email: faker.internet.email(),
      password: hashedPassword,
    })),
  ];
};

const generateUniqueStudents = () => {
  const studentNames = new Set();
  const students = [];

  while (students.length < 100) {
    const name = faker.person.fullName();
    if (!studentNames.has(name)) {
      studentNames.add(name);
      students.push({
        name,
        age: faker.number.int({ min: 18, max: 25 }),
        grade: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E']),
      });
    }
  }

  return students;
};

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await Student.deleteMany({});
    console.log('Collections cleared.');

    const users = await generateUsers();
    await User.insertMany(users);
    console.log('Users added.');

    const uniqueStudents = generateUniqueStudents();
    await Student.insertMany(uniqueStudents);
    console.log('Students added.');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

seedDatabase();
