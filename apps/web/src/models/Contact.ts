import mongoose, { model, Schema } from "mongoose";

export interface ContactDocument {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress: string;
  userAgent: string;
  status: "new" | "read" | "responded";
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<ContactDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [5, "Subject must be at least 5 characters"],
      maxlength: [200, "Subject must not exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [5000, "Message must not exceed 5000 characters"],
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "read", "responded"],
      default: "new",
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
ContactSchema.index({ email: 1, createdAt: -1 });
ContactSchema.index({ status: 1 });

const Contact =
  mongoose.models.Contact || model<ContactDocument>("Contact", ContactSchema);

export default Contact;
