import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";
import { contactFormLimiter } from "@/lib/rateLimiter";
import { validateContactData } from "@/lib/validation";
import ContactAdminEmail from "@/components/emailTemplates/ContactAdminEmail";
import getResend from "@/lib/resend";
import ContactConfirmationEmail from "@/components/emailTemplates/ContactConfirmationEmail";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

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
        { status: 429 },
      );
    }

    // Parse and validate request body
    const { email, name, subject, message } = await req.json();
    const body = { email, name, subject, message };

    // Validate and sanitize input
    const validation = validateContactData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 },
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
        { status: 400 },
      );
    }

    // Save to database
    await contact.save();

    // Send email notifications (non-blocking on failure)

    try {
      const resend = await getResend();
      await resend.emails.send({
        from: process.env.CONTACT_NOTIFICATION_EMAIL || "",
        to: process.env.ADMIN_EMAIL || "",
        subject: contact.subject,
        react: ContactAdminEmail({
          senderEmail: contact.email,
          senderName: contact.name,
          subject: contact.subject,
          message: contact.message,
        }),
      });

      await resend.emails.send({
        from: process.env.NO_REPLY_EMAIL || "",
        to: contact.email,
        subject: `New Contact Form Submission: ${contact.subject}`,
        react: ContactConfirmationEmail({
          name: contact.name,
          subject: contact.subject,
        }),
      });
    } catch (e) {
      console.error("Failed to send contact form emails:", e);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Your message has been received. We'll get back to you soon!",
        data: {
          id: contact._id,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[Contact API Error]:", error);

    // Don't expose internal errors to client
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing your request",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/contact
 * Retrieve contact messages (admin only)
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

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
      { status: 500 },
    );
  }
}
