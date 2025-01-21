import express from 'express';
import verifyToken from '../middlewares/authMiddleware.js';
import studentController from '../controllers/studentController.js';

const router = express.Router();

router.get('/', verifyToken, studentController.getStudents);
router.post('/', verifyToken, studentController.createStudent);
router.patch('/:id', verifyToken, studentController.updateStudent);
router.delete('/:id', verifyToken, studentController.deleteStudent);

export default router;