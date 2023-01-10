import mongoose from 'mongoose';
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    birthday: {
        type: Date,
        require: true,
    },
    id: {
        type: String,
        require: true,
        unique: true
    },
    class: {
        type: String,
        unique: true
    }
});
export const Student = mongoose.model('Student', studentSchema);