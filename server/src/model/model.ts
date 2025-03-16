import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Unique ID
  url: { type: String, }, // Solution URL
  host: { type: String, required: true }, // Platform hosting the contest
  event: { type: String, required: true }, // Related event/Title name
  start: {type:String, required:true},
  duration: {type:Number, required:true},
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const Contest = mongoose.model("Contests", ContestSchema);

export default Contest;
