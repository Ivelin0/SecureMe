import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
}

const userSchema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = model<User>("User", userSchema);
export default User;
