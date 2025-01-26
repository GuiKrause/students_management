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

            // Get pagination details from query params
            const { page = 1, limit = 10, name = '' } = req.query;

            // Create a case-insensitive regex to match names if 'name' is provided
            const nameRegex = name ? new RegExp(`^${name}`, 'i') : null;

            const query = nameRegex ? { name: { $regex: nameRegex } } : {};

            // Paginate using mongoose-paginate-v2
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { createdAt: -1 },
                lean: true
            };

            const result = await Student.paginate(query, options);

            res.json({
                page: result.page,
                limit: result.limit,
                total: result.totalDocs,
                totalPages: result.totalPages,
                data: result.docs
            });
        } catch (error) {
            console.error(error);
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
