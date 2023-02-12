import mongoose from 'mongoose';

export async function connect() {
  mongoose.connect("mongodb://127.0.0.1:27017/demonodedb");
  console.log('connected to db');
}
