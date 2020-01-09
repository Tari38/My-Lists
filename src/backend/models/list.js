import { Schema as _Schema, Types, model } from "mongoose";

const Schema = _Schema;

const listSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  image: { type: String, required: false },
  creator: { type: Types.ObjectId, required: false, ref: "User" }
});

export default model("List", listSchema);
