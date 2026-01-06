import mongoose, { model, ObjectId, Schema } from "mongoose";

export interface UserDocument {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bookmarks: ObjectId[];
  verified: boolean;
}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email is invalid",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    verified: { type: Boolean, default: false }, // email verification
    bookmarks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
