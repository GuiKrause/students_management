import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    grade: { type: String, required: true },
}, {timestamps: true});

studentSchema.plugin(mongoosePaginate);

const Student = mongoose.model('Student', studentSchema);

export default Student;
