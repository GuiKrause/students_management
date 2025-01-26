import Student from "../models/studentModel.js";

import mongoose from 'mongoose';

class StudentController {

    // Create a new student
    async createStudent(req, res) {
        try {
            const student = new Student(req.body);
            const savedStudent = await student.save();
            res.status(201).json(savedStudent);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Get a student by ID or all students
    async getStudents(req, res) {
        try {
            // Check if a specific student ID is provided
            if (req.params.id) {
                const student = await Student.findById(req.params.id);
                if (!student) {
                    return res.status(404).json({ message: 'Student not found' });
                }
                return res.json(student);
            }

            // Handle pagination
            const page = parseInt(req.query.page) || 1; // Default to page 1
            const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
            const skip = (page - 1) * limit;

            // Get the 'name' query parameter if provided
            const name = req.query.name ? req.query.name : '';

            // Create a case-insensitive regex to match names
            const nameRegex = new RegExp(`^${name}`, 'i'); // 'i' makes it case-insensitive

            // Fetch paginated students and the total count, with optional name filtering
            const [students, total] = await Promise.all([
                Student.find({ name: { $regex: nameRegex } }).skip(skip).limit(limit),
                Student.countDocuments({ name: { $regex: nameRegex } })
            ]);

            // Return paginated results
            res.json({
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                data: students
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Update a student by ID
    async updateStudent(req, res) {
        try {
            const updatedStudent = await Student.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
            res.json(updatedStudent);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Delete a student by ID
    async deleteStudent(req, res) {
        try {
            const id = req.params.id;
            const deletedStudent = await Student.findByIdAndDelete({ _id: id });
            if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
            res.json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new StudentController();
