import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Unique ID
  url: { type: String, required: true }, // Solution URL
  host: { type: String, required: true }, // Platform hosting the solution
  event: { type: String, required: true }, // Related event name
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const Solution = mongoose.model("Solution", solutionSchema);

export default Solution;
