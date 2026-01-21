import mongoose, { model, ObjectId, Schema } from "mongoose";

export interface UserDocument {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  bookmarks: ObjectId[];
  verified: boolean;
  role: string;
  passwordChangedAt: Date;
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
    role: {
      type: String,
      required: true,
      default: "user",
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },

    avatar: {
      type: String,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    verified: { type: Boolean, default: false }, // email verification
    bookmarks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Photo" }],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
