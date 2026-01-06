import mongoose, { model, Schema } from "mongoose";

export interface BugReportDocument {
  _id: string;
  title: string;
  email: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  browser?: string;
  attachments?: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "new" | "investigating" | "acknowledged" | "resolved" | "closed";
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const BugReportSchema = new Schema<BugReportDocument>(
  {
    title: {
      type: String,
      required: [true, "Bug title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters"],
      maxlength: [200, "Title must not exceed 200 characters"],
      index: true,
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
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
      maxlength: [3000, "Description must not exceed 3000 characters"],
    },
    stepsToReproduce: {
      type: String,
      trim: true,
      maxlength: [2000, "Steps must not exceed 2000 characters"],
    },
    expectedBehavior: {
      type: String,
      required: [true, "Expected behavior is required"],
      trim: true,
      minlength: [10, "Expected behavior must be at least 10 characters"],
      maxlength: [1000, "Expected behavior must not exceed 1000 characters"],
    },
    actualBehavior: {
      type: String,
      required: [true, "Actual behavior is required"],
      trim: true,
      minlength: [10, "Actual behavior must be at least 10 characters"],
      maxlength: [1000, "Actual behavior must not exceed 1000 characters"],
    },
    browser: {
      type: String,
      trim: true,
      maxlength: [200, "Browser info must not exceed 200 characters"],
    },
    attachments: {
      type: String,
      trim: true,
      maxlength: [500, "Attachments info must not exceed 500 characters"],
    },
    severity: {
      type: String,
      enum: {
        values: ["low", "medium", "high", "critical"],
        message: "Severity must be one of: low, medium, high, critical",
      },
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["new", "investigating", "acknowledged", "resolved", "closed"],
        message:
          "Status must be one of: new, investigating, acknowledged, resolved, closed",
      },
      default: "new",
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for efficient querying
BugReportSchema.index({ email: 1, createdAt: -1 });
BugReportSchema.index({ status: 1, severity: 1 });
BugReportSchema.index({ createdAt: -1 });

const BugReport =
  mongoose.models.BugReport ||
  model<BugReportDocument>("BugReport", BugReportSchema);

export default BugReport;
