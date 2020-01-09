import { Schema as _Schema, Types, model } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const Schema = _Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: false },
  lists: [{ type: Types.ObjectId, required: false, ref: "List" }]
});

userSchema.plugin(uniqueValidator);

export default model("User", userSchema);
