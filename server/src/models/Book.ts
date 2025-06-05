import { Schema } from 'mongoose';

// Este schema será usado como subdocumento en savedBooks del modelo User
const bookSchema = new Schema({
  bookId: { type: String, required: true },
  authors: [String],
  description: { type: String, required: true },
  title: { type: String, required: true },
  image: String,
  link: String,
});

export default bookSchema;
