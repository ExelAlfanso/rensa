import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";
import { contactFormLimiter } from "@/lib/rateLimiter";
import { validateContactData } from "@/lib/validation";
import {
  sendContactConfirmationEmail,
  sendContactToAdmin,
} from "@/services/EmailService";

/**
 * POST /api/contact
 * Submit a contact form inquiry
 *
 * Security measures:
 * - Input validation and sanitization
 * - Rate limiting (5 requests per hour per IP)
 * - MongoDB validation schemas
 * - Error messages don't leak sensitive info
 */
export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const { success } = await contactFormLimiter.limit(ip);
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate and sanitize input
    const validation = validateContactData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create contact document
    const contact = new Contact({
      ...validation.data,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || "",
    });

    // Validate using Mongoose schema
    const validationError = contact.validateSync();
    if (validationError) {
      const errors: Record<string, string> = {};
      Object.entries(validationError.errors).forEach(([key, error]: any) => {
        errors[key] = error.message;
      });

      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    // Save to database
    await contact.save();

    // Send email notifications (non-blocking on failure)
    const notifyAdmin = sendContactToAdmin(
      contact.email,
      contact.name,
      contact.subject,
      contact.message
    );
    const notifyUser = sendContactConfirmationEmail(
      contact.email,
      contact.name,
      contact.subject
    );
    Promise.allSettled([notifyAdmin, notifyUser]).then((results) => {
      results.forEach((r, i) => {
        if (
          r.status === "rejected" ||
          (r.status === "fulfilled" && r.value === false)
        ) {
          console.warn(
            `Contact email ${i === 0 ? "admin" : "user"} notification failed.`,
            r.status === "rejected" ? r.reason : undefined
          );
        }
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We'll get back to you soon!",
        data: {
          id: contact._id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Contact API Error]:", error);

    // Don't expose internal errors to client
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact
 * Retrieve contact messages (admin only)
 */
export async function GET(req: Request) {
  try {
    // TODO: Add authentication check for admin users
    // if (!isAdmin) return unauthorized response
    // const session = getServerSession(authOptions);
    // if()
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "new";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const contacts = await Contact.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments({ status });

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Contact GET API Error]:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve contacts",
      },
      { status: 500 }
    );
  }
}
