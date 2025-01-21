import Student from "../models/studentModel.js";

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
            if (req.params.id) {
                const student = await Student.findById(req.params.id);
                if (!student) return res.status(404).json({ message: 'Student not found' });
                return res.json(student);
            }

            const students = await Student.find();
            res.json(students);
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
            const deletedStudent = await Student.findByIdAndDelete(req.params.id);
            if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
            res.json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new StudentController();
